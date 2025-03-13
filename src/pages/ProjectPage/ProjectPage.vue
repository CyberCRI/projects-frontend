<script setup>
import utils from '@/functs/functions.ts'
import { getSuggestedProjects } from '@/api/welearn.service.ts'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { getComments as getCommentApi } from '@/api/comments.service'
import { getProjectMessages as getProjectMessagesApi } from '@/api/project-messages.service'
import { getProjectLocations as getProjectLocationsApi } from '@/api/locations.services'
import { getAttachmentLinks } from '@/api/attachment-links.service.ts'
import { getAttachmentFiles } from '@/api/attachment-files.service.ts'
import { getProjectAnnouncements } from '@/api/announcements.service'
import { getBlogEntries as getBlogEntriesApi } from '@/api/blogentries.service'
import { getAllGoals } from '@/api/goals.service'
import { getProject } from '@/api/projects.service'
import { getReviews as getReviewsApi } from '@/api/reviews.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import useUsersStore from '@/stores/useUsers.ts'

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const projectsStore = useProjectsStore()
const usersStore = useUsersStore()
const runtimeConfig = useRuntimeConfig()

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const { isAdmin, canEditProject } = usePermissions()

const modals = ref({
  project: {
    visible: false,
    editedItem: null,
  },
  goal: {
    visible: false,
    editedItem: null,
  },
  sdg: {
    visible: false,
  },
  teamMember: {
    visible: false,
  },
  announcement: {
    visible: false,
    editedItem: null,
  },
  resource: {
    visible: false,
    editedItem: null,
  },
  comment: {
    visible: false,
    editedItem: {
      originalComment: null,
      repliedComment: null,
    },
  },
  linkedProject: {
    visible: false,
    editedItem: null,
  },
  blogEntry: {
    visible: false,
    editedItem: null,
  },
  location: {
    visible: false,
    editedItem: null,
  },
})

const project = computed(() => projectsStore.project)

const toggleAddModal = (modalType, editedItem = null) => {
  if (editedItem) {
    modals.value[modalType].editedItem = editedItem
  } else modals.value[modalType].editedItem = null

  modals.value[modalType].visible = !modals.value[modalType].visible
}

const goToTab = async (tab, dontFocusTab) => {
  let tabPath = `/projects/${project.value.slug}/${tab}`
  if (route.path !== tabPath) {
    if (!dontFocusTab) tabPath += '#tab'
    return router.push(tabPath)
  } else {
    // still add hash to url
    if (route && route.hash !== '#tab') {
      tabPath += '#tab'
      await router.push(tabPath)
    }
    // however previous route change dont trigger beforeRouteEnter
    if (!dontFocusTab) {
      utils.scrollTo(document.querySelector('.tabs-wrapper'))
    }
    return Promise.resolve()
  }
}

// data

const similarProjects = useState(() => [])
const sockerserver = ref(runtimeConfig.public.appWssHost)
const provider = ref(null)
const loading = ref(true)
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

// computed

const isMemberOrAdmin = computed(() => {
  const members = [...team.value.members, ...team.value.owners, ...team.value.reviewers]
  return isAdmin.value || members.find((user) => usersStore.id === user.id)
})

const accessToken = computed(() => usersStore.accessToken)

const mergedTeam = computed(() => {
  // this is damn ugly but necessary for compatibility with TeamResultList
  // witch expects [{user: { ... }, role: '...'}, {user: { ... }, role: '...'} ... ]
  return [
    ...(team.value.owners || []),
    ...(team.value.reviewers || []),
    ...(team.value.members || []),
    ...(team.value.people_groups || []),
  ].map((user) => ({
    user,
  }))
})

// method

const cleanupProvider = () => {
  if (provider.value) {
    provider.value.destroy()
    provider.value = null
  }
}

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
const getLinkedProjects = async (_linkedProjects) => {
  if (_linkedProjects) {
    linkedProjects.value = _linkedProjects
  } else {
    try {
      // TODO beg for a dedicated endpoint
      const response = await getProject(project.value.id)
      linkedProjects.value = response.linked_projects
    } catch (err) {
      console.error(err)
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
    const response = await getProjectAnnouncements(project.value.id)
    announcements.value = response.results
  } catch (err) {
    console.error(err)
  }
}

const setProject = async (projectSlugOrId = route.params.slugOrId) => {
  loading.value = true
  projectsStore
    .getProject(projectSlugOrId)
    .then(async (project) => {
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
      connectToSocket(project.id)
      loading.value = false
    })
    .catch((err) => {
      console.log(err)
      router.replace({
        name: 'page404',
        params: { pathMatch: route.path.substring(1).split('/') },
      })
    })
}

const reloadProject = async () => {
  return await projectsStore.getProject(project.value.id)
}

const projectPatched = (data) => {
  if (provider.value?.document) {
    const projectUpdates = provider.value.document.getMap('projectUpdates')
    projectUpdates.set('data', { ...data, clientID: provider.value.document.clientID })
  }
}

const onProjectUpdate = async () => {
  const projectUpdates = provider.value.document.getMap('projectUpdates')
  const data = projectUpdates.get('data')

  // skip if we are the ones who updated the description
  if (provider.value.document.clientID == data.clientID) return

  // skip if update is before current project / blog data update time
  if (data.type == 'blog-entry-create' || data.type == 'blog-entry-update') {
    let old = (project.value.blog_entries || []).find((b) => b.id == data.id)
    if (old && old.updated_at >= data.updated_at) {
      return
    }
  } else if (data.type === 'description-update') {
    if (project.value.updated_at >= data.updated_at) {
      return
    }
  }

  // update project (yes, the whole project... TODO: fine grain this)
  reloadProject()

  // real update, notify user
  let message = data.author_name + ' ' + t(data.scope)

  toaster.pushInfo(message)
}

const connectToSocket = () => {
  // listen for description updates
  // TODO permission
  if (canEditProject.value) {
    try {
      const providerParams = {
        projectId: projectsStore.currentProjectId,
        organizationId: organizationsStore.current.id,
      }

      provider.value = new HocuspocusProvider({
        url: sockerserver.value,
        name: 'description_update_' + project.value.id,
        token: accessToken.value,
        parameters: providerParams,
      })

      const projectUpdates = toRaw(provider.value).document.getMap('projectUpdates')

      // Listen for changes
      projectUpdates.observe(onProjectUpdate)
    } catch (e) {
      console.error('socket error', e)
    }
  }
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

// provide

provide('projectLayoutToggleAddModal', toggleAddModal)
provide('projectLayoutGoToTab', goToTab)
provide('projectLayoutProjectPatched', projectPatched)

// hooks

// onBeforeUnmount(() => {
//     if (commentLoop.value) clearInterval(commentLoop.value)
//     cleanupProvider()
// })

try {
  // project might need access right
  const projectData = await getProject(route.params.slugOrId, true)
  if (projectData)
    useLpiHead(
      useRequestURL().toString(),
      projectData.title,
      projectData.purpose,
      projectData?.header_image?.variations?.medium
    )
} catch {
  // DGAF
  // console.log(err)
}

//onCreated(() => {
//onMounted(() => {
if (import.meta.client) {
  await setProject(route.params.slugOrId)
  utils.resetScroll()
}
//})

onBeforeRouteUpdate((to, from, next) => {
  if (to.params.slugOrId !== from.params.slugOrId) {
    if (commentLoop.value) clearInterval(commentLoop.value)
    cleanupProvider()
    setProject(to.params.slugOrId)
    if (import.meta.client) utils.resetScroll()
  }
  next()
})

if (import.meta.client) {
  watchEffect(() => {
    if (route.hash == '#tab') {
      nextTick(() => utils.scrollTo(document.querySelector('.tabs-wrapper')))
    }
  })
}
</script>
<template>
  <div class="page-section-extra-wide project-layout">
    <LazyProjectHeader
      :project="project"
      :sdgs="sdgs"
      :similar-projects="similarProjects"
      :loading="loading"
      class="project-header"
      :announcements="announcements"
      :follow="follow"
      @show-project-announcements="goToTab('announcements')"
      @update-follow="follow = $event"
    />

    <div class="tabs-wrapper">
      <ProjectTabsSkeleton v-if="loading" />
      <LazyProjectTabs
        v-else
        :project="project"
        :locations="locations"
        :comments="comments"
        :project-messages="projectMessages"
        :announcements="announcements"
        :similar-projects="similarProjects"
        :file-resources="fileResources"
        :link-resources="linkResources"
        :blog-entries="blogEntries"
        :goals="goals"
        :sdgs="sdgs"
        :team="team"
        :reviews="reviews"
        :linked-projects="linkedProjects"
        @reload-comments="getComments(project.id)"
        @reload-project-messages="getProjectMessages(project.id)"
        @reload-project="reloadProject"
        @reload-announcements="getAnnouncements"
        @reload-file-resources="getFileResources"
        @reload-link-resources="getLinkResources"
        @reload-blog-entries="getBlogEntries"
        @reload-goals="getGoals"
        @reload-sdgs="getSdgs"
        @reload-team="reloadTeam"
        @reload-reviews="getReviews"
        @reload-linked-projects="getLinkedProjects"
      />
    </div>

    <!-- add/edit modals -->
    <LazyProjectDrawer
      v-if="modals.project.visible"
      :is-opened="modals.project.visible"
      @close="toggleAddModal('project')"
      @project-edited="reloadProject"
    />
    <LazyGoalDrawer
      :project="project"
      :edited-goal="modals.goal.editedItem"
      :is-opened="modals.goal.visible"
      @close="toggleAddModal('goal')"
      @reload-goals="getGoals"
    />
    <LazyTeamDrawer
      :project="project"
      :current-users="mergedTeam"
      :selected-categories="project?.categories || []"
      :edited-user="modals.teamMember?.editedItem || null"
      :is-opened="modals.teamMember.visible"
      @close="toggleAddModal('teamMember')"
      @reload-team="reloadTeam"
    />
    <LazyResourceDrawer
      :project="project"
      :is-add-mode="!modals.resource.editedItem"
      :is-opened="modals.resource.visible"
      :selected-item="modals.resource.editedItem"
      @close="toggleAddModal('resource')"
      @reload-file-resources="getFileResources"
      @reload-link-resources="getLinkResources"
    />
    <LazyAnnouncementDrawer
      :project="project"
      :announcement="modals.announcement.editedItem"
      :is-add-mode="!modals.announcement.editedItem"
      :is-opened="modals.announcement.visible"
      @reload-announcements="getAnnouncements"
      @close="toggleAddModal('announcement')"
    />
    <LazyLinkedProjectDrawer
      :project="project"
      :already-linked-projects="linkedProjects"
      :edited-linked-project="modals.linkedProject.editedItem"
      :is-opened="modals.linkedProject.visible"
      @reload-linked-projects="getLinkedProjects($event)"
      @close="toggleAddModal('linkedProject')"
    />
    <LazyLocationDrawer
      :project-id="project?.id"
      :locations="locations"
      :is-opened="modals.location.visible"
      @reload-locations="getProjectLocations"
      @close="toggleAddModal('location')"
    />
    <LazyBlogDrawer
      :project="project"
      :edited-blog="modals.blogEntry.editedItem"
      :is-add-mode="!modals.blogEntry.editedItem"
      :is-opened="modals.blogEntry.visible"
      @close="toggleAddModal('blogEntry')"
      @reload-blog-entries="getBlogEntries"
    />

    <LazySdgsDrawer
      class="medium"
      :project="project"
      :is-opened="modals.sdg.visible"
      :sdgs="sdgs || []"
      @reload-sdgs="getSdgs"
      @close="toggleAddModal('sdg')"
    />
  </div>
</template>

<style lang="scss" scoped>
.project-layout {
  margin-top: pxToRem(48px);

  .project-header {
    width: 100%;
    display: block;
    flex-direction: column;
    align-items: center;

    @media (min-width: $min-tablet) {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}

@media (max-width: $min-tablet) {
  .tabs-wrapper {
    padding: 0 $space-xs;
  }
}
</style>
