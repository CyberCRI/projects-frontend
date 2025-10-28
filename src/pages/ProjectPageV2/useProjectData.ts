// import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'
import useProjectCategories from '@/stores/useProjectCategories'

import { getSuggestedProjects } from '@/api/welearn.service'
import { getProjectMessages as getProjectMessagesApi } from '@/api/project-messages.service'
import { getProjectLocations as getProjectLocationsApi } from '@/api/locations.services'
import { getAttachmentFiles } from '@/api/attachment-files.service'
import { api } from '@/api/SwaggerProjects'
import { getAllGoals } from '@/api/goals.service'
import { getProject, duplicateProject as duplicateProjectAPI } from '@/api/projects.service'
import { getReviews as getReviewsApi } from '@/api/reviews.service'

import analytics from '@/analytics'
import { Announcement, AttachmentLink, Comment } from '@/api/Swagger'
import { sortBlogEntry } from '@/api/sanitize/blogentries'

export default function useProjectData() {
  // const toaster = useToasterStore()
  const organizationsStore = useOrganizationsStore()
  const projectsStore = useProjectsStore()
  const usersStore = useUsersStore()
  // const runtimeConfig = useRuntimeConfig()

  const {
    translateProject,
    translateProjects,
    translateComments,
    translateProjectMessages,
    translateLocations,
    translateAnnouncements,
    translateGoals,
    translateBlogEntries,
    translateReviews,
    translateFiles,
    translateLinks,
    translateUser,
    translateTeam,
  } = useAutoTranslate()

  const projectCategoriesStore = useProjectCategories()

  const route = useRoute()
  const router = useRouter()
  const { t } = useNuxtI18n()

  const { isAdmin, canEditProject, isOrgUser } = usePermissions()

  const isMemberOrAdmin = computed(() => {
    const members = [...team.value.members, ...team.value.owners, ...team.value.reviewers]
    return isAdmin.value || members.find((user) => usersStore.id === user.id)
  })

  // const project = computed(() => projectsStore.project)
  const _project: ComputedRef<any> = computed(() => projectsStore.project)
  const project: ComputedRef<any> = translateProject(_project)

  const _similarProjects: Ref<any> = ref([])
  const _comments = ref<Comment[]>([])
  const _projectMessages: Ref<any> = ref([])
  const _locations: Ref<any> = ref([])
  const _announcements = ref<Announcement[]>([])
  const _fileResources: Ref<any> = ref([])
  const _linkResources = ref<AttachmentLink[]>([])
  const _blogEntries: Ref<any> = ref([])
  const _goals: Ref<any> = ref([])
  const _team: Ref<any> = ref({ owners: [], members: [], reviewers: [] })
  const _reviews: Ref<any> = ref([])
  const _linkedProjects: Ref<any> = ref([])

  const similarProjects: ComputedRef<any> = translateProjects(_similarProjects)
  const comments: ComputedRef<any> = translateComments(_comments)
  const projectMessages: ComputedRef<any> = translateProjectMessages(_projectMessages)
  const locations: ComputedRef<any> = translateLocations(_locations)
  const announcements: ComputedRef<any> = translateAnnouncements(_announcements)
  const fileResources: ComputedRef<any> = translateFiles(_fileResources)
  const linkResources: ComputedRef<any> = translateLinks(_linkResources)
  const blogEntries: ComputedRef<any> = translateBlogEntries(_blogEntries)
  const goals: ComputedRef<any> = translateGoals(_goals)
  const team: ComputedRef<any> = translateTeam(_team)
  const reviews: ComputedRef<any> = translateReviews(_reviews)
  const linkedProjects: ComputedRef<any> = translateProjects(_linkedProjects)

  const follow = ref({ is_followed: false })
  const sdgs = ref([])
  const commentLoop = ref(null)
  const linkedProjectsLoading = ref(false)

  const mergedTeam = computed(() => {
    // this is damn ugly but necessary for compatibility with TeamResultList
    // witch expects [{user: { ... }, role: '...'}, {user: { ... }, role: '...'} ... ]
    return [
      ...(team.value.owners || []),
      ...(team.value.reviewers || []),
      ...(team.value.members || []),
      ...((team.value as any).people_groups || []),
    ].map((user) => ({
      user: unref(translateUser(user)),
    }))
  })

  const getReviews = async () => {
    try {
      const response = await getReviewsApi(project.value.id)
      _reviews.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getGoals = async () => {
    try {
      const response = await getAllGoals(project.value.id)
      _goals.value = response.results
    } catch (err) {
      console.error(err)
    }
  }
  const getLinkedProjects = async (forcedLinkedProjects = null) => {
    if (forcedLinkedProjects) {
      // refreshing from a drawer edit update
      _linkedProjects.value = forcedLinkedProjects
    } else {
      try {
        linkedProjectsLoading.value = true
        // TODO beg for a dedicated endpoint
        const response = await getProject(project.value.id)
        _linkedProjects.value = response.linked_projects
      } catch (err) {
        console.error(err)
      } finally {
        linkedProjectsLoading.value = false
      }
    }
  }
  const getSdgs = async () => {
    try {
      // TODO beg for a dedicated endpoint
      const response = await getProject(project.value.id)
      sdgs.value = response.sdgs
    } catch (err) {
      console.error(err)
    }
  }
  const getTeam = async () => {
    try {
      // TODO beg for a dedicated endpoint
      const response = await getProject(project.value.id)
      _team.value = response.team
    } catch (err) {
      console.error(err)
    }
  }

  const reloadTeam = async () => {
    await getTeam()
    // reload current user rights in case they changed
    await usersStore.getUser(usersStore.userFromApi.id)
  }

  const getBlogEntries = async () => {
    try {
      const response = await api.v1.projectBlogEntryList(project.value.id)
      _blogEntries.value = sortBlogEntry(response.results)
    } catch (err) {
      console.error(err)
    }
  }

  const getFileResources = async () => {
    try {
      const response = await getAttachmentFiles(project.value.id)
      _fileResources.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getLinkResources = async () => {
    try {
      const response = await api.v1.projectLinkList(project.value.id)
      _linkResources.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getComments = async (project_id) => {
    try {
      const response = await api.v1.projectCommentList(project_id)
      _comments.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getProjectMessages = async (project_id) => {
    try {
      const response = await getProjectMessagesApi(project_id)
      _projectMessages.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getAnnouncements = async () => {
    try {
      const response = await api.v1.projectAnnouncementList(project.value.id)
      _announcements.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const reloadProject = async () => {
    return await projectsStore.getProject(project.value.id)
  }

  const setProject = async (projectSlugOrId) => {
    const project = await projectsStore.getProject(projectSlugOrId)
    // TODO watch here it was the computed project value instead
    follow.value = project.is_followed
    _goals.value = project.goals
    sdgs.value = project.sdgs
    _team.value = project.team
    _reviews.value = project.reviews
    _linkedProjects.value = project.linked_projects

    const extraData = [
      getComments(project.id), // TODO remove param and use this.proejct.id in method, also chnage handler
      getProjectLocations(),
      getSimilarProjects(),
      getAnnouncements(),
      getFileResources(),
      getLinkResources(),
      getBlogEntries(),
    ]

    if (isMemberOrAdmin.value) {
      extraData.push(
        // TODO remove param and use this.proejct.id in method, also chnage handler
        getProjectMessages(project.id)
      )
    }
    await Promise.all(extraData)
    if (commentLoop.value) {
      clearInterval(commentLoop.value)
      commentLoop.value = null
    }
    commentLoop.value = setInterval(
      () => {
        getComments(project.id)
        if (isMemberOrAdmin.value) {
          getProjectMessages(project.id)
        }
      },
      5 * 60 * 1000
    )
  }

  const getProjectLocations = async () => {
    try {
      const res = await getProjectLocationsApi(project.value.id)
      _locations.value = res
    } catch (err) {
      console.error(err)
    }
  }

  const getSimilarProjects = async () => {
    try {
      const res = await getSuggestedProjects(project.value.id, organizationsStore.current?.code)
      _similarProjects.value = res
    } catch (err) {
      console.error(err)
    }
  }

  function isRoute(name) {
    return route && route.name === name
  }

  const categories = computed(() => projectCategoriesStore.hierarchy)

  const categoryForCurrentOrganization = computed(() => {
    return project.value?.categories?.find(
      (category) => category.organization === organizationsStore.current.code
    )
  })

  const categoryHierarchy = computed(() => {
    return [
      {
        name: t('home.home'),
        route: { name: 'HomeRoot' },
      },
      {
        name: t('category.title'),
        route: { name: 'Categories' },
      },
      ...(categoryForCurrentOrganization.value?.hierarchy || []).map((cat) => ({
        name: cat.name,
        route: { name: 'Category', params: { slugOrId: cat.slug || cat.id } },
      })),
      ...(categoryForCurrentOrganization.value
        ? [
            {
              name: categoryForCurrentOrganization.value.name,
              route: {
                name: 'Category',
                params: {
                  slugOrId:
                    categoryForCurrentOrganization.value.slug ||
                    categoryForCurrentOrganization.value.id,
                },
              },
            },
          ]
        : []),
    ]
  })

  const duplicateProject = async () => {
    const originalProject = project.value

    const projectCopy = await duplicateProjectAPI(originalProject.id)

    // fetch updated project list from user so permissions as set correctly
    await usersStore.getUser(usersStore.id)

    analytics.project.duplicate(originalProject.id, projectCopy.id)

    await projectsStore.updateProject({
      id: projectCopy.id,
      project: {
        title: `${originalProject.title} ${t('project.copy')}`,
      },
    })

    return projectCopy
  }

  const projectDisplayTabs = computed(() =>
    [
      {
        key: 'project-summary',
        label: t('project.summary'),
        view: `/projects/${route.params.slugOrId}/summary`,
        altView: `/projects/${route.params.slugOrId}/summary/edit`,
        props: {
          project: project.value,
          comments: comments.value,
          goals: goals.value,
          sdgs: sdgs.value,
          similarProjects: similarProjects.value,
          locations: locations.value,
          fileResources: fileResources.value,
          linkResources: linkResources.value,
          blogEntries: blogEntries.value,
          team: team.value,
          reviews: reviews.value,
          linkedProjects: linkedProjects.value,
          onReloadReviews: () => getReviews(),
          onReloadProject: () => reloadProject(),
        },
        condition: true,
        dataTest: 'project-summary',
        icon: 'Home',
        noTitle: true,
      },
      {
        key: 'project-description',
        label: t('form.description'),
        view: `/projects/${route.params.slugOrId}/description`,
        altView: `/projects/${route.params.slugOrId}/description/edit`,
        props: {
          project: project.value,
        },
        condition: true,
        dataTest: 'project-description',
        icon: 'Article',
      },
      {
        key: 'project-team',
        label: t('team.team'),
        view: `/projects/${route.params.slugOrId}/team`,
        altView: `/projects/${route.params.slugOrId}/team/edit`,
        props: {
          project: project.value,
          team: team.value,
          onReloadTeam: () => {
            console.log('reload tabs')
            reloadTeam()
          },
        },
        condition: true,
        dataTest: 'project-team',
        icon: 'PeopleGroup',
      },

      {
        key: 'project-locations',
        label: t('project.add-to-project.location'),
        view: `/projects/${route.params.slugOrId}/locations`,
        altView: `/projects/${route.params.slugOrId}/locations/edit`,
        props: {
          project: project.value,
          locations: locations.value,
        },
        condition: locations.value.length || isRoute('projectLocations'),
        dataTest: 'project-locations',
        icon: 'MapMarker',
      },
      {
        key: 'project-goals',
        label: t('goal.goals'),
        view: `/projects/${route.params.slugOrId}/goals`,
        altView: `/projects/${route.params.slugOrId}/goals/edit`,
        props: {
          project: project.value,
          goals: goals.value,
          sdgs: sdgs.value,
          onReloadGoals: () => getGoals(),
          onReloadSdgs: () => getSdgs(),
        },
        condition: goals.value?.length || sdgs.value?.length || isRoute('projectGoals'), // prevent error when emptying the current tab
        dataTest: 'project-goals',
        icon: 'TimerLine',
      },
      {
        key: 'project-blog',
        label: t('blog.title'),
        view: `/projects/${route.params.slugOrId}/blog-entries`,
        altView: `/projects/${route.params.slugOrId}/blog-entries/edit`,
        props: {
          project: project.value,
          blogEntries: blogEntries.value,
          onReloadBlogEntries: () => getBlogEntries(),
        },
        condition: !!blogEntries.value.length || isRoute('projectBlog'), // prevent error when emptying the current tab
        dataTest: 'project-blog',
        icon: 'Progress5',
      },
      {
        key: 'project-resources',
        label: t('resource.resources'),
        view: `/projects/${route.params.slugOrId}/resources`,
        altView: `/projects/${route.params.slugOrId}/resources/edit`,
        props: {
          project: project.value,
          fileResources: fileResources.value,
          linkResources: linkResources.value,
          onReloadFileResources: () => getFileResources(),
          onReloadLinkResources: () => getLinkResources(),
        },
        condition:
          project?.value?.files?.length ||
          project?.value?.links?.length ||
          isRoute('projectResources'), // prevent error when emptying the current tab
        dataTest: 'project-resources',
        icon: 'Globe',
      },
      {
        key: 'project-linked-projects',
        label: t('project.linked-projects'),
        view: `/projects/${route.params.slugOrId}/linked-projects`,
        altView: `/projects/${route.params.slugOrId}/linked-projects/edit`,
        props: {
          project: project.value,
          linkedProjects: linkedProjects.value,
          onReloadLinkedProjects: () => getLinkedProjects(),
        },
        condition: !!linkedProjects.value?.length || isRoute('projectLinkedProjects'), // prevent error when emptying the current tab
        dataTest: 'project-linked-projects',
        icon: 'LinkRotated',
      },
      {
        key: 'project-announcements',
        label: t('home.announcements'),
        view: `/projects/${route.params.slugOrId}/announcements`,
        altView: `/projects/${route.params.slugOrId}/announcements/edit`,
        props: {
          project: project.value,
          announcements: announcements.value,
          onReloadAnnouncements: () => getAnnouncements(),
        },
        condition: announcements.value?.length > 0 || isRoute('projectAnnouncements'), // prevent error when emptying the current tab
        dataTest: 'project-announcements',
        icon: 'BullhornOutline',
      },
      {
        key: 'project-comments',
        label: t('comment.comments'),
        view: `/projects/${route.params.slugOrId}/comments`,
        altView: `/projects/${route.params.slugOrId}/comments/edit`,
        props: {
          project: project.value,
          comments: comments.value,
          onReloadComments: () => getComments(project.value.id),
        },
        condition: true,
        dataTest: 'project-comments',
        icon: 'ChatBubble',
      },
      {
        key: 'project-private-exchange',
        label: t('comment.private-exchange.tab'),
        view: `/projects/${route.params.slugOrId}/private-exchange`,
        altView: `/projects/${route.params.slugOrId}/private-exchange/edit`,
        props: {
          project: project.value,
          team: team.value,
          projectMessages: projectMessages.value,
          onReloadProjectMessages: () => getProjectMessages(project.value.id),
        },
        condition: isMemberOrAdmin.value,
        dataTest: 'project-private-exchange',
        icon: 'EmailOutline',
      },
      // {
      //   key: 'project-settings',
      //   label: t('project.settings'),
      //   view: `/projects/${route.params.slugOrId}/project-settings`,
      //   altView: `/projects/${route.params.slugOrId}/project-settings/edit`,
      //   condition: true,
      //   props: {
      //     project: project.value,
      //     team: team.value,
      //     categories: categories.value,
      //     onReloadTeam: () => reloadTeam(),
      //     onReloadReviews: () => getReviews(),
      //     onReloadProject: () => reloadProject(),
      //   },
      //   dataTest: 'project-settings',
      //   icon: 'Cog',
      // },
    ].map((t) => ({ ...t, isEditing: false }))
  )

  const projectDisplayTabsFiltered = computed(() =>
    projectDisplayTabs.value.filter((tab) => tab.condition)
  )

  const projectEditTabs = computed(() =>
    [
      {
        key: 'project-summary',
        label: t('project.summary'),
        view: `/projects/${route.params.slugOrId}/summary/edit`,
        altView: `/projects/${route.params.slugOrId}/summary`,
        props: {
          project: project.value,
          comments: comments.value,
          goals: goals.value,
          sdgs: sdgs.value,
          similarProjects: similarProjects.value,
          locations: locations.value,
          fileResources: fileResources.value,
          linkResources: linkResources.value,
          blogEntries: blogEntries.value,
          team: team.value,
          reviews: reviews.value,
          linkedProjects: linkedProjects.value,
          onReloadReviews: () => getReviews(),
          onReloadProject: () => reloadProject(),
        },
        condition: true,
        dataTest: 'project-summary',
        icon: 'Home',
      },
      {
        key: 'project-description',
        label: t('form.description'),
        view: `/projects/${route.params.slugOrId}/description/edit`,
        altView: `/projects/${route.params.slugOrId}/description`,
        props: {
          project: project.value,
        },
        condition: true,
        dataTest: 'project-description',
        icon: 'Article',
      },
      {
        key: 'project-team',
        label: t('team.team'),
        view: `/projects/${route.params.slugOrId}/team/edit`,
        altView: `/projects/${route.params.slugOrId}/team`,
        props: {
          project: project.value,
          team: team.value,
          isInEditingMode: true,
          onReloadTeam: () => {
            console.log('reload tabs')
            reloadTeam()
          },
        },
        condition: true,
        dataTest: 'project-team',
        icon: 'PeopleGroup',
        addModal: 'teamMember',
      },

      {
        key: 'project-locations',
        label: t('project.add-to-project.location'),
        view: `/projects/${route.params.slugOrId}/locations/edit`,
        altView: `/projects/${route.params.slugOrId}/locations`,
        props: {
          project: project.value,
          locations: locations.value,
          isInEditingMode: true,
          onReloadLocations: () => getProjectLocations(),
        },
        condition: locations.value.length || isRoute('projectLocationsEdit'),
        dataTest: 'project-locations',
        icon: 'MapMarker',
        addModal: 'location',
      },
      {
        key: 'project-goals',
        label: t('goal.goals'),
        view: `/projects/${route.params.slugOrId}/goals/edit`,
        altView: `/projects/${route.params.slugOrId}/goals`,
        props: {
          project: project.value,
          goals: goals.value,
          sdgs: sdgs.value,
          isInEditingMode: true,
          onReloadGoals: () => getGoals(),
          onReloadSdgs: () => getSdgs(),
        },
        condition: goals.value?.length || sdgs.value?.length || isRoute('projectGoals'), // prevent error when emptying the current tab
        dataTest: 'project-goals',
        icon: 'TimerLine',
        addModal: 'goalOrSdg',
      },
      {
        key: 'project-blog',
        label: t('blog.title'),
        view: `/projects/${route.params.slugOrId}/blog-entries/edit`,
        altView: `/projects/${route.params.slugOrId}/blog-entries`,
        props: {
          project: project.value,
          blogEntries: blogEntries.value,
          isInEditingMode: true,
          onReloadBlogEntries: () => getBlogEntries(),
        },
        condition: !!blogEntries.value.length || isRoute('projectBlog'), // prevent error when emptying the current tab
        dataTest: 'project-blog',
        icon: 'Progress5',
        addModal: 'blogEntry',
      },
      {
        key: 'project-resources',
        label: t('resource.resources'),
        view: `/projects/${route.params.slugOrId}/resources/edit`,
        altView: `/projects/${route.params.slugOrId}/resources`,
        props: {
          project: project.value,
          fileResources: fileResources.value,
          linkResources: linkResources.value,
          isInEditingMode: true,
          onReloadFileResources: () => getFileResources(),
          onReloadLinkResources: () => getLinkResources(),
        },
        condition:
          project.value &&
          (fileResources.value.length || linkResources.value.length || isRoute('projectResources')), // prevent error when emptying the current tab
        dataTest: 'project-resources',
        icon: 'Globe',
        addModal: 'resource',
      },
      {
        key: 'project-linked-projects',
        label: t('project.linked-projects'),
        view: `/projects/${route.params.slugOrId}/linked-projects/edit`,
        altView: `/projects/${route.params.slugOrId}/linked-projects`,
        props: {
          project: project.value,
          linkedProjects: linkedProjects.value,
          isInEditingMode: true,
          onReloadLinkedProjects: () => getLinkedProjects(),
        },
        condition: !!linkedProjects.value?.length || isRoute('projectLinkedProjects'), // prevent error when emptying the current tab
        dataTest: 'project-linked-projects',
        icon: 'LinkRotated',
        addModal: 'linkedProject',
      },
      {
        key: 'project-announcements',
        label: t('home.announcements'),
        view: `/projects/${route.params.slugOrId}/announcements/edit`,
        altView: `/projects/${route.params.slugOrId}/announcements`,
        props: {
          project: project.value,
          announcements: announcements.value,
          isInEditingMode: true,
          onReloadAnnouncements: () => getAnnouncements(),
        },
        condition: announcements.value?.length > 0 || isRoute('projectAnnouncements'), // prevent error when emptying the current tab
        dataTest: 'project-announcements',
        icon: 'BullhornOutline',
        addModal: 'announcement',
      },
      {
        key: 'project-comments',
        label: t('comment.comments'),
        view: `/projects/${route.params.slugOrId}/comments/edit`,
        altView: `/projects/${route.params.slugOrId}/comments`,
        props: {
          project: project.value,
          comments: comments.value,
          isInEditingMode: true,
          onReloadComments: () => getComments(project.value.id),
        },
        condition: true,
        dataTest: 'project-comments',
        icon: 'ChatBubble',
      },
      {
        key: 'project-private-exchange',
        label: t('comment.private-exchange.tab'),
        view: `/projects/${route.params.slugOrId}/private-exchange/edit`,
        altView: `/projects/${route.params.slugOrId}/private-exchange`,
        props: {
          project: project.value,
          team: team.value,
          projectMessages: projectMessages.value,
          isInEditingMode: true,
          onReloadProjectMessages: () => getProjectMessages(project.value.id),
        },
        condition: isMemberOrAdmin.value,
        dataTest: 'project-private-exchange',
        icon: 'EmailOutline',
      },
      {
        key: 'project-settings',
        label: t('project.settings'),
        view: `/projects/${route.params.slugOrId}/project-settings/edit`,
        altView: `/projects/${route.params.slugOrId}/summary`,
        condition: true,
        props: {
          project: project.value,
          team: team.value,
          categories: categories.value,
          onReloadTeam: () => reloadTeam(),
          onReloadReviews: () => getReviews(),
          onReloadProject: () => reloadProject(),
        },
        dataTest: 'project-settings',
        icon: 'Cog',
      },
    ].map((t) => ({
      ...t,
      isEditing: true,
      isAddAction: !t.condition,
      actionIcon: t.condition ? 'Pen' : 'Plus',
      condition: true,
      dataTest: t.dataTest + (t.condition ? '-edit' : '-add'),
    }))
  )

  const projectEditTabsFiltered = computed(() =>
    projectEditTabs.value.filter((tab) => tab.condition)
  )

  const allProjectTabs = computed(() => [...projectEditTabs.value, ...projectDisplayTabs.value])

  const currentTab = computed(() => {
    return allProjectTabs.value.find((tab) => route.path.indexOf(tab.view) === 0)
  })

  const isEditing = computed(() => currentTab.value?.isEditing || false)

  const projectTabs = computed(() =>
    isEditing.value ? projectEditTabsFiltered.value : projectDisplayTabsFiltered.value
  )

  const toggleEditing = () => {
    //isEditing.value = state
    router.push(currentTab.value.altView)
  }

  const actionMenu = computed(() =>
    [
      {
        icon: 'Copy',
        condition: canEditProject.value || isOrgUser.value,
        label: t('project.duplicate'),
        isAddAction: true,
        addModal: 'duplicate',
        dataTest: 'duplicate-project',
      },
      {
        icon: 'Bug',
        condition: true,
        label: t('report.bug'),
        isAddAction: true,
        addModal: 'bug',
        dataTest: 'report-bug',
      },
      {
        icon: 'Flag',
        condition: true,
        label: t('report.abuse'),
        isAddAction: true,
        addModal: 'abuse',
        dataTest: 'report-abuse',
      },
    ].filter((a) => a.condition)
  )

  return {
    // data
    isMemberOrAdmin,
    project,
    similarProjects,
    comments,
    projectMessages,
    locations,
    announcements,
    fileResources,
    linkResources,
    blogEntries,
    follow,
    goals,
    sdgs,
    team,
    reviews,
    linkedProjects,
    commentLoop,
    linkedProjectsLoading,
    isEditing,
    //computed
    mergedTeam,
    projectTabs,
    currentTab,
    categoryHierarchy,
    actionMenu,
    // methods
    getReviews,
    getGoals,
    getLinkedProjects,
    getSdgs,
    getTeam,
    reloadTeam,
    getBlogEntries,
    getFileResources,
    getLinkResources,
    getComments,
    getProjectMessages,
    getAnnouncements,
    reloadProject,
    setProject,
    getProjectLocations,
    getSimilarProjects,
    toggleEditing,
    duplicateProject,
  }
}
