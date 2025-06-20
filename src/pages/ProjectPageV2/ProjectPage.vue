<script setup>
import utils from '@/functs/functions.ts'
import useProjectData from './useProjectData.ts'
import useProjectSocket from './useProjectSocket.ts'
import useProjectModals from './useProjectModals.ts'
import useProjectNav from './useProjectNav.ts'
import { getProject } from '@/api/projects.service'

const route = useRoute()
const router = useRouter()

const { modals, toggleAddModal } = useProjectModals()

const loading = ref(true)
const isNavCollapsed = ref(window?.innerWidth < 768)
const toggleNavPanel = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}

const onNavigated = () => {
  if (window.innerWidth < 768) {
    isNavCollapsed.value = true
  }
}

const uniqueId = 'project-nav-panel'
watchEffect(() => {
  if (!import.meta.client) return
  if (!isNavCollapsed.value) {
    if (window.innerWidth < 768) {
      document.querySelector('body').classList.add(`has-open-drawer-${uniqueId}`)
    }
  } else {
    document.querySelector('body').classList.remove(`has-open-drawer-${uniqueId}`)
  }
})

function onWindowResize() {
  if (window.innerWidth >= 768) {
    document.querySelector('body').classList.remove(`has-open-drawer-${uniqueId}`)
  } else if (!isNavCollapsed.value) {
    document.querySelector('body').classList.add(`has-open-drawer-${uniqueId}`)
  }
}

onMounted(() => {
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  // if destroyed before closing, need to cleanup un-scrollable body
  document.querySelector('body').classList.remove(`has-open-drawer-${uniqueId}`)
  window.removeEventListener('resize', onWindowResize)
})

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
  currentTab,
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
} catch (err) {
  // DGAF
  console.log(err)
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

// if (import.meta.client) {
//   watchEffect(() => {
//     if (route.hash == '#tab') {
//       nextTick(() => utils.scrollTo(document.querySelector('.tabs-wrapper')))
//     }
//   })
// }
</script>
<template>
  <div class="page-section-extra-wide project-layout">
    <div class="breadcrumbs-ctn">
      <LpiButton
        :btn-icon="isNavCollapsed ? 'MenuUnfoldLine' : 'MenuFoldLine'"
        class="toggle-button"
        @click="toggleNavPanel"
      />
      <BreadCrumbs :breadcrumbs="categoryHierarchy || []" />
    </div>
    <div class="tabs-wrapper">
      <div class="project-nav-panel">
        <transition name="backdrop-fade">
          <div
            v-if="!loading && !isNavCollapsed"
            class="nav-panel-backdrop"
            @click="isNavCollapsed = true"
          ></div>
        </transition>
        <transition name="slide-panel">
          <LazyProjectNavPanel
            v-if="!loading && !isNavCollapsed"
            :class="{ collapsed: isNavCollapsed }"
            :project-tabs="projectTabs"
            :current-tab="currentTab"
            :project="project"
            :announcements="announcements"
            :similar-projects="similarProjects"
            :follow="follow"
            class="slide-panel"
            @update-follow="follow = $event"
            @navigated="onNavigated"
          />
        </transition>
        <div class="content-panel">
          <h2 v-if="!currentTab.noTitle" class="content-title">
            {{ project?.title }} - {{ currentTab.label }}
          </h2>
          <NuxtPage v-bind="currentTab.props" />
        </div>
      </div>
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

.nav-panel-backdrop {
  display: none;

  @media (max-width: $min-tablet) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 70%);
    z-index: 99;
  }
}

@media (max-width: $min-tablet) {
  .tabs-wrapper {
    padding: 0 $space-xs;
  }
}

.breadcrumbs-ctn {
  display: flex;
  align-items: center;
  gap: 1rem;

  @media screen and (max-width: $min-tablet) {
    .breadcrumbs {
      padding-left: 2.6rem;
    }

    .toggle-button {
      position: fixed;
      z-index: 110;
    }
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

.project-nav-panel {
  display: flex;
  gap: 3rem;
  position: relative;
}

.content-panel {
  flex-basis: 100%;
}

.content-title {
  color: $primary-dark;
  font-size: $font-size-4xl;
}

@media screen and (max-width: $min-tablet) {
  .slide-panel-enter-from,
  .slide-panel-leave-to {
    transform: translateX(-100%);
  }

  .slide-panel-enter-active,
  .slide-panel-leave-active {
    transition: transform 0.2s ease-in-out;
  }

  .slide-panel-enter-to,
  .slide-panel-leave-from {
    transform: translateX(0);
  }

  .backdrop-fade-enter-active,
  .backdrop-fade-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  .backfrop-fade-enter-to,
  .backdrop-fade-leave-from {
    opacity: 1;
  }

  .backdrop-fade-enter-from,
  .backdrop-fade-leave-to {
    opacity: 0;
  }
}
</style>
