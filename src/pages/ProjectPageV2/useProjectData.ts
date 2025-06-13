// import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'
import useProjectCategories from '@/stores/useProjectCategories'

import { getSuggestedProjects } from '@/api/welearn.service'
import { getComments as getCommentApi } from '@/api/comments.service'
import { getProjectMessages as getProjectMessagesApi } from '@/api/project-messages.service'
import { getProjectLocations as getProjectLocationsApi } from '@/api/locations.services'
import { getAttachmentLinks } from '@/api/attachment-links.service'
import { getAttachmentFiles } from '@/api/attachment-files.service'
import { getProjectAnnouncements } from '@/api/announcements.service'
import { getBlogEntries as getBlogEntriesApi } from '@/api/blogentries.service'
import { getAllGoals } from '@/api/goals.service'
import { getProject } from '@/api/projects.service'
import { getReviews as getReviewsApi } from '@/api/reviews.service'

export default function useProjectData() {
  // const toaster = useToasterStore()
  const organizationsStore = useOrganizationsStore()
  const projectsStore = useProjectsStore()
  const usersStore = useUsersStore()
  // const runtimeConfig = useRuntimeConfig()

  const projectCategoriesStore = useProjectCategories()

  const route = useRoute()
  const { t } = useI18n()

  const { isAdmin /*, canEditProject*/ } = usePermissions()

  const isMemberOrAdmin = computed(() => {
    const members = [...team.value.members, ...team.value.owners, ...team.value.reviewers]
    return isAdmin.value || members.find((user) => usersStore.id === user.id)
  })

  const project = computed(() => projectsStore.project)

  const similarProjects = useState(() => [])
  const comments = useState(() => [])
  const projectMessages = useState(() => [])
  const locations = useState(() => [])
  const announcements = useState(() => [])
  const fileResources = useState(() => [])
  const linkResources = useState(() => [])
  const blogEntries = useState(() => [])
  const follow = useState(() => ({ is_followed: false }))
  const goals = useState(() => [])
  const sdgs = useState(() => [])
  const team = useState(() => ({ owners: [], members: [], reviewers: [] }))
  const reviews = useState(() => [])
  const linkedProjects = useState(() => [])
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
      user,
    }))
  })

  const getReviews = async () => {
    try {
      const response = await getReviewsApi(project.value.id)
      reviews.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getGoals = async () => {
    try {
      const response = await getAllGoals(project.value.id)
      goals.value = response.results
    } catch (err) {
      console.error(err)
    }
  }
  const getLinkedProjects = async (_linkedProjects = null) => {
    if (_linkedProjects) {
      linkedProjects.value = _linkedProjects
    } else {
      try {
        linkedProjectsLoading.value = true
        // TODO beg for a dedicated endpoint
        const response = await getProject(project.value.id)
        linkedProjects.value = response.linked_projects
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
      team.value = response.team
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
      const response = await getBlogEntriesApi(project.value.id)
      blogEntries.value = (response.results || []).sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    } catch (err) {
      console.error(err)
    }
  }

  const getFileResources = async () => {
    try {
      const response = await getAttachmentFiles(project.value.id)
      fileResources.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getLinkResources = async () => {
    try {
      const response = await getAttachmentLinks(project.value.id)
      linkResources.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getComments = async (project_id) => {
    try {
      const response = await getCommentApi(project_id)
      comments.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getProjectMessages = async (project_id) => {
    try {
      const response = await getProjectMessagesApi(project_id)
      projectMessages.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const getAnnouncements = async () => {
    try {
      const response = await getProjectAnnouncements(project.value.id, {})
      announcements.value = response.results
    } catch (err) {
      console.error(err)
    }
  }

  const reloadProject = async () => {
    return await projectsStore.getProject(project.value.id)
  }

  const setProject = async (projectSlugOrId) => {
    return projectsStore.getProject(projectSlugOrId).then(async (project) => {
      // TODO watch here it was the computed project value instead
      follow.value = project.is_followed
      goals.value = project.goals
      sdgs.value = project.sdgs
      team.value = project.team
      reviews.value = project.reviews
      linkedProjects.value = project.linked_projects

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
      if (!commentLoop.value) {
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
    })
  }

  const getProjectLocations = async () => {
    try {
      locations.value = await getProjectLocationsApi(project.value.id)
    } catch (err) {
      console.error(err)
    }
  }

  const getSimilarProjects = async () => {
    try {
      similarProjects.value = await getSuggestedProjects(
        project.value.id,
        organizationsStore.current?.code
      )
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

  const projectTabs = computed(() =>
    [
      {
        key: 'project-summary',
        label: t('project.summary'),
        view: `/projects/${route.params.slugOrId}/summary`,
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
        props: {
          project: project.value,
        },
        condition: true,
        dataTest: 'project-description',
        icon: 'Article',
      },
      {
        key: 'project-goals',
        label: t('goal.goals'),
        view: `/projects/${route.params.slugOrId}/goals`,
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
        props: {
          project: project.value,
          fileResources: fileResources.value,
          linkResources: linkResources.value,
          onReloadFileResources: () => getFileResources(),
          onReloadLinkResources: () => getLinkResources(),
        },
        condition:
          (project.value && !!(project.value.files.length || project.value.links.length)) ||
          isRoute('projectResources'), // prevent error when emptying the current tab
        dataTest: 'project-resources',
        icon: 'Globe',
      },
      {
        key: 'project-linked-projects',
        label: t('project.linked-projects'),
        view: `/projects/${route.params.slugOrId}/linked-projects`,
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
        key: 'project-team',
        label: t('team.team'),
        view: `/projects/${route.params.slugOrId}/team`,
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
        key: 'project-comments',
        label: t('comment.comments'),
        view: `/projects/${route.params.slugOrId}/comments`,
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
        props: {
          project: project.value,
          team: team.value,
          projectMessages: projectMessages.value,
          onReloadProjectMessages: () => getProjectMessages(project.value.id),
        },
        condition: isMemberOrAdmin.value,
        dataTest: 'project-private-exchange',
        icon: 'ChatBubble',
      },
      {
        key: 'project-announcements',
        label: t('home.announcements'),
        view: `/projects/${route.params.slugOrId}/announcements`,
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
        key: 'project-settings',
        label: t('project.settings'),
        view: `/projects/${route.params.slugOrId}/project-settings`,
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
    ].filter((tab) => tab.condition)
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
    //computed
    mergedTeam,
    projectTabs,
    categoryHierarchy,
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
  }
}
