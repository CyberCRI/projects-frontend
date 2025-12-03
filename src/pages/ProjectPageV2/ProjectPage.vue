<script setup>
import utils from '@/functs/functions.ts'
import useProjectData from './useProjectData.ts'
import useProjectSocket from './useProjectSocket.ts'
import useProjectModals from './useProjectModals.ts'
import useProjectNav from './useProjectNav.ts'
import { getProject } from '@/api/projects.service'
import useToasterStore from '@/stores/useToaster.ts'
import useGlobalsStore from '@/stores/useGlobals.ts'

const route = useRoute()
const router = useRouter()

const globalsStore = useGlobalsStore()

const toaster = useToasterStore()

const { t } = useI18n()

const { modals, toggleAddModal } = useProjectModals()

const loading = ref(true)

const uniqueId = 'project-nav-panel'
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)

const onNavigated = collapseIfUnderBreakpoint

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
  postFecthProjectHook,
  //computed
  mergedTeam,
  projectTabs,
  currentTab,
  categoryHierarchy,
  isEditing,
  actionMenu,
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
  toggleEditing,
  duplicateProject,
} = useProjectData({ toggleAddModal })

const { connectToSocket, cleanupProvider, projectPatched } = useProjectSocket({
  project,
  reloadProject,
  getBlogEntries,
})

const { translateProject } = useAutoTranslate()

const { goToProjectTab } = useProjectNav(route.params.slugOrId)

const onDuplicateProject = async () => {
  try {
    // emit('asyncing', true)
    globalsStore.uiIsLocked = true

    const projectCopy = await duplicateProject()
    router.push({
      name: 'projectSummary',
      params: { slugOrId: projectCopy.slug },
    })

    toaster.pushSuccess(t('toasts.project-duplication.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.project-duplication.error')} (${error})`)
    console.error(error)
  } finally {
    // emit('asyncing', false)
    globalsStore.uiIsLocked = false
  }
}

// provide
provide('projectLayoutToggleAddModal', toggleAddModal)
provide('projectLayoutGoToTab', goToProjectTab)
provide('projectLayoutProjectPatched', projectPatched)

// hooks

// onBeforeUnmount(() => {
//     if (commentLoop.value) clearInterval(commentLoop.value)
//     cleanupProvider()
// })
const setLpiHead = (_projectData) => {
  if (_projectData) {
    const projectData = translateProject(_projectData)
    const { image, dimensions } = useImageAndDimension(projectData.value?.header_image, 'medium')
    try {
      useLpiHead(
        useRequestURL().toString(),
        computed(() => projectData.value?.$t?.title || projectData.value.title),
        computed(() => projectData.value?.$t?.purpose || projectData.value.purpose),
        image,
        dimensions
      )
    } catch (e) {
      console.error(e)
    }
  }
}
if (import.meta.server) {
  try {
    // project might need access right
    const projectData = await getProject(route.params.slugOrId, true)
    setLpiHead(projectData)
  } catch (err) {
    // DGAF
    console.log(err)
  }
}

postFecthProjectHook.value = setLpiHead

onMounted(async () => {
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
})

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
      nextTick(() => window?.scrollTo({ top: 0, behavior: 'smooth' }))
    }
  })
}

const chooseGoalOrSdg = (choice) => {
  toggleAddModal(choice)
  toggleAddModal('goalOrSdg')
}
</script>
<template>
  <div
    class="page-section-extra-wide project-layout"
    :class="{
      'project-edit-layout': isEditing,
      'project-display-layout': !isEditing,
    }"
  >
    <NavPanelLayout
      v-if="!loading"
      :is-loading="loading"
      :is-nav-collapsed="isNavCollapsed"
      :breadcrumbs="categoryHierarchy || []"
      @toggle-nav-panel="toggleNavPanel"
      @collapse-nav-panel="isNavCollapsed = true"
    >
      <template #nav-panel>
        <LazyProjectNavPanel
          v-if="!loading && !isNavCollapsed"
          class="slide-panel"
          :class="{ collapsed: isNavCollapsed }"
          :project-tabs="projectTabs"
          :current-tab="currentTab"
          :project="project"
          :announcements="announcements"
          :similar-projects="similarProjects"
          :follow="follow"
          :is-editing="isEditing"
          :action-menu="actionMenu"
          @toggle-editing="toggleEditing"
          @update-follow="follow = $event"
          @navigated="onNavigated"
          @duplicate-project="onDuplicateProject"
        />
      </template>
      <template #content>
        <SubPageTitle :title-prefix="project?.$t?.title" :current-tab="currentTab" />
        <NuxtPage v-bind="currentTab?.props" />
      </template>
    </NavPanelLayout>

    <NavPanelLoader v-if="loading" />

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
    <LazyProjectResourceDrawer
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
    <LazyGoalOrSdgsDrawer
      :is-opened="modals.goalOrSdg.visible"
      @close="toggleAddModal('goalOrSdg')"
      @choice-made="chooseGoalOrSdg"
    />

    <LazyReportDrawer :is-opened="modals.bug.visible" type="bug" @close="toggleAddModal('bug')" />

    <LazyReportDrawer
      :is-opened="modals.abuse.visible"
      type="abuse"
      @close="toggleAddModal('abuse')"
    />
  </div>
</template>

<style lang="scss" scoped>
.project-layout {
  margin-top: pxToRem(48px);
}
</style>
