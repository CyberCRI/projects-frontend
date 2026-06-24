<script setup lang="ts">
import { useProjectHierarchy } from '~/composables/project/useProjectHierarchy'
import ProjectNavPanel from '~/components/project/Nav/ProjectNavPanel.vue'
import { useProjectTabs } from '~/composables/project/useProjectTabs'
import { projectSkeleton } from '@/skeletons/project.skeletons'
import type { ProjectSlugOrId } from '@/models/project.model'
import { getProject } from '@/api/v2/project.service'
import useProjectsStore from '~/stores/useProjects'

const route = useRoute()

const uniqueId = 'project-nav-panel'
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)

const { canEditProject } = usePermissions()

const projectIdOrSlug = computed<ProjectSlugOrId>(() => route.params.slugOrId.toString())

const organizationCode = useOrganizationCode()
const {
  status,
  data: project,
  error,
  isLoading,
} = getProject(organizationCode, projectIdOrSlug, {
  default: projectSkeleton,
})

const { tabs, currentTab, isEditing, toggleEditing } = useProjectTabs(projectIdOrSlug, project)

// set headers
watchEffect(() => {
  useLpiHead2({
    title: project.value?.$t.title,
    description: project.value?.$t.purpose,
    image: project.value?.header_image,
  })
})

const breadcrumbs = useProjectHierarchy(project)

const editable = computed(() => isEditing.value && canEditProject.value)

const propsTab = computed(() => ({
  editable: editable.value,
  project: project.value,
  // @ts-expect-error ignore props not defined
  ...(currentTab.value.props || {}),
  loading: isLoading.value,
}))

// TODO rework this
// this is only for permission project
const projectStore = useProjectsStore()
watchEffect(() => {
  if (project.value.id) {
    projectStore.project = project.value
  }
})
onUnmounted(() => {
  projectStore.project = null
})
</script>

<template>
  <div
    class="page-section-extra-wide project-layout"
    :class="{
      'project-edit-layout': isEditing,
      'project-display-layout': !isEditing,
    }"
  >
    <FetchLoader
      :status="status"
      only-error
      :error="error"
      error404
      skeleton
      :with-data="!!project?.id"
    >
      <NavPanelLayout
        :is-nav-collapsed="isNavCollapsed"
        :breadcrumbs="breadcrumbs"
        @toggle-nav-panel="toggleNavPanel"
        @collapse-nav-panel="isNavCollapsed = true"
      >
        <template #nav-panel>
          <ProjectNavPanel
            v-if="!isNavCollapsed"
            class="slide-panel"
            :class="{ collapsed: isNavCollapsed }"
            :project-tabs="tabs"
            :current-tab="currentTab"
            :project="project"
            :is-editing="isEditing"
            @toggle-editing="toggleEditing"
            @navigated="collapseIfUnderBreakpoint"
          />
        </template>
        <template #content>
          <SubPageTitle :title-prefix="project.$t.title" :current-tab="currentTab" />
          <NuxtPage v-if="currentTab" v-bind="propsTab" />
        </template>
      </NavPanelLayout>
    </FetchLoader>
  </div>
</template>

<style lang="scss" scoped>
.project-layout {
  margin-top: pxToRem(48px);
}
</style>
