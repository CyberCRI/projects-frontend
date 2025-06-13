<script setup>
import utils from '@/functs/functions.ts'
import useProjectData from './useProjectData.ts'
import useProjectSocket from './useProjectSocket.ts'
import useProjectModals from './useProjectModals.ts'
import useProjectNav from './useProjectNav.ts'

const route = useRoute()
const router = useRouter()

const { modals, toggleAddModal } = useProjectModals()

const loading = ref(true)

const {
  // data
  project,
  similarProjects,
  locations,
  announcements,
  follow,
  sdgs,
  linkedProjects,
  commentLoop,
  linkedProjectsLoading,
  //computed
  mergedTeam,
  projectTabs,
  categoryHierarchy,
  // methods
  getGoals,
  getLinkedProjects,
  getSdgs,
  reloadTeam,
  getBlogEntries,
  getFileResources,
  getLinkResources,
  getAnnouncements,
  reloadProject,
  setProject,
  getProjectLocations,
} = useProjectData()

const { connectToSocket, cleanupProvider, projectPatched } = useProjectSocket({
  project,
  reloadProject,
  getBlogEntries,
})

const { goToProjectTab } = useProjectNav(route.params.slugOrId)

// provide
provide('projectLayoutToggleAddModal', toggleAddModal)
provide('projectLayoutGoToTab', goToProjectTab)
provide('projectLayoutProjectPatched', projectPatched)

// hooks

// onBeforeUnmount(() => {
//     if (commentLoop.value) clearInterval(commentLoop.value)
//     cleanupProvider()
// })

try {
  // project might need access right
  const projectData = await getProject(route.params.slugOrId, true)
  const { image, dimensions } = useImageAndDimension(projectData?.header_image, 'medium')
  if (projectData)
    useLpiHead(
      useRequestURL().toString(),
      projectData.title,
      projectData.purpose,
      image,
      dimensions
    )
} catch {
  // DGAF
  // console.log(err)
}

//onCreated(() => {
//onMounted(() => {
if (import.meta.client) {
  try {
    loading.value = true
    await setProject(route.params.slugOrId)
    connectToSocket(project.id)
    loading.value = false
    utils.resetScroll()
  } catch (err) {
    console.log(err)
    router.replace({
      name: 'page404',
      params: { pathMatch: route.path.substring(1).split('/') },
    })
  }
}
//})

onBeforeRouteUpdate((to, from, next) => {
  if (to.params.slugOrId !== from.params.slugOrId) {
    if (commentLoop.value) clearInterval(commentLoop.value)
    cleanupProvider()
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
    <div class="breadcrumbs-ctn">
      <BreadCrumbs :breadcrumbs="categoryHierarchy || []" />
    </div>

    <div class="tabs-wrapper">
      <LazyProjectNavPanel
        v-if="!loading"
        :project-tabs="projectTabs"
        :project="project"
        :announcements="announcements"
        :similar-projects="similarProjects"
        :follow="follow"
        @update-follow="follow = $event"
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
      :is-loading="linkedProjectsLoading"
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

.breadcrumb {
  font-weight: 700;
  font-size: 14px;
  line-height: $line-height-compact;
  color: $primary-dark;
}

@media screen and (max-width: $min-tablet) {
  .breadcrumb {
    margin-bottom: 14px;
  }

  .visibility {
    color: $primary-dark;
  }
}
</style>
