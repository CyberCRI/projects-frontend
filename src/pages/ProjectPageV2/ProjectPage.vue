<script setup lang="ts">
import { useProjectHierarchy } from '@/pages/ProjectPageV2/useProject'
import { useProjectTabs } from '@/pages/ProjectPageV2/ProjectTabs'
import { projectSkeleton } from '@/skeletons/project.skeletons'
import type { ProjectSlugOrId } from '@/models/project.model'
import { getProject } from '@/api/v2/project.service'

const route = useRoute()

const { t } = useNuxtI18n()

const uniqueId = 'project-nav-panel'
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)

const { canEditProject, isOrgUser } = usePermissions()

const projectIdOrSlug = computed<ProjectSlugOrId>(() => route.params.slugOrId.toString())

const organizationCode = useOrganizationCode()
const {
  status,
  data: project,
  error,
} = getProject(organizationCode, projectIdOrSlug, {
  default: projectSkeleton,
})

const { tabs, currentTab, isEditing, toggleEditing } = useProjectTabs(projectIdOrSlug, project)

// set headers
watchEffect(() => {
  useLpiHead2({
    title: project.value?.$t?.title,
    description: project.value?.$t?.purpose,
    image: project.value?.header_image,
  })
})

const breadcrumbs = useProjectHierarchy(project)
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

// const { connectToSocket, cleanupProvider, projectPatched } = useProjectSocket({
//   project,
//   reloadProject,
//   getBlogEntries,
// })
// onMounted(() => {
//   if (import.meta.client) {
//     connectToSocket()
//   }
// })

// const onDuplicateProject = async () => {
//   try {
//     // emit('asyncing', true)
//     globalsStore.uiIsLocked = true

//     const projectCopy = await duplicateProject()
//     router.push({
//       name: 'ProjectSnapshot',
//       params: { slugOrId: projectCopy.slug },
//     })

//     toaster.pushSuccess(t('toasts.project-duplication.success'))
//   } catch (error) {
//     toaster.pushError(`${t('toasts.project-duplication.error')} (${error})`)
//     console.error(error)
//   } finally {
//     // emit('asyncing', false)
//     globalsStore.uiIsLocked = false
//   }
// }

// provide
provide('projectLayoutToggleAddModal', () => {})
provide('projectLayoutGoToTab', () => {})
provide('projectLayoutProjectPatched', () => {})

const editable = computed(() => isEditing.value && canEditProject.value)

const propsTab = computed(() => ({
  editable: editable.value,
  project: project.value,
}))
</script>

<template>
  <div
    class="page-section-extra-wide project-layout"
    :class="{
      'project-edit-layout': isEditing,
      'project-display-layout': !isEditing,
    }"
  >
    <FetchLoader :status="status" only-error :error="error" error404 skeleton>
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
            :action-menu="actionMenu"
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
