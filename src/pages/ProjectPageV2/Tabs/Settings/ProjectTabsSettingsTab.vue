<script setup lang="ts">
import type {
  ProjectTab,
  ProjectTabForm,
  ProjectTabType,
  TranslatedProject,
  TranslatedProjectTab,
} from 'shared-projects-frontend/models'
import ProjectAddiionalsCreateTab from '~/pages/ProjectPageV2/Tabs/Additionals/ProjectAddiionalsCreateTab.vue'
import { createProjectTab, deleteProjectTab, updateProjectTab } from 'shared-projects-frontend/apis'
import { refreshProjectData, refreshProjectTabs } from '~/composables/project/refreshProject'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { defaultTab, isCustomTab, sanitizeTabs } from '~/functs/tabs'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { Sortable } from 'sortablejs-vue3'
import { deepToRaw } from '~/functs/utils'
import { isEqual } from 'es-toolkit'
import analytics from '~/analytics'

const props = defineProps<{
  project: TranslatedProject
}>()

const { t } = useNuxtI18n()
const toaster = useToaster()

const organizationCode = useOrganizationCode()

const projectId = computed(() => props.project.id)

const { canCreateTab } = usePermissionProject(
  projectId,
  computed(() => props.project)
)

const {
  data: tabs,
  status,
  isLoading,
} = getAllProjectTab(organizationCode, projectId, {
  paginationConfig: {
    limit: 999,
  },
  query: {
    modules: 'none',
  },
  default: () => factoryPagination(projectTabSkeleton, 0, 0),
  uniqueKey: 'settings',
})
const allTabs = computed(() => sanitizeTabs(tabs.value, props.project.modules))

// sortable
const DRAG_OPTIONS = {
  animation: 200,
  disabled: false,
  ghostClass: 'child-ghost',
}

const { stateModals, openModals, closeAllModals } = useModals({
  add: false,
  edit: false,
  delete: false,
})

const fullRefresh = () => {
  return refreshProjectData(props.project).then(() => refreshProjectTabs(props.project))
}

const onEditRefresh = () => {
  clean()
  fullRefresh().then(() => clean())
}

const selectTab = ref<ProjectTab>(null)
const asyncing = ref(false)
const clean = () => {
  selectTab.value = null
  asyncing.value = false
  closeAllModals()
}

const onUpdateOrCreate = (modelKey: ProjectTabType | ProjectTab['id'], form: ProjectTabForm) => {
  if (typeof modelKey === 'string') {
    const body = {
      ...defaultTab(modelKey),
      ...form,
    }
    if (body.order < 0) {
      body.order = 0
    }
    return createProjectTab(
      props.project.id,
      body,

      {
        query: { modules: 'none' },
      }
    )
  }

  return updateProjectTab(props.project.id, modelKey, form, {
    query: {
      modules: 'none',
    },
  })
}

const onChange = (tabs: ProjectTab[]) => {
  // filter only with element changed
  const tabsChanged = tabs
    .map((tab, idx) => ({ ...tab, order: idx }))
    .filter((tab, idx) => !isEqual(tab, allTabs.value[idx]))

  if (tabsChanged.length === 0) {
    asyncing.value = false
    return
  }

  Promise.all(
    tabsChanged.map((item) =>
      // add only order/show_tab to update
      onUpdateOrCreate(item.id || item.type, {
        order: item.order,
        show_tab: item.show_tab,
      })
    )
  )
    .then(() => fullRefresh())
    .then(() => toaster.pushSuccess(t('tab.toasts.tab-update.success')))
    .catch(() => toaster.pushError(t('tab.toasts.tab-update.error')))
    .finally(() => clean())
}

const onDrag = (ev) => {
  asyncing.value = true

  const { oldIndex, newIndex } = ev

  // move old index element to new positions
  const copyAllTabs: TranslatedProjectTab[] = deepToRaw(allTabs.value)
  const [element] = copyAllTabs.splice(oldIndex, 1)
  copyAllTabs.splice(newIndex, 0, element)

  onChange(copyAllTabs)
}

const onVisibilityChange = (modifiedTab: ProjectTab, value: boolean) => {
  asyncing.value = true

  const copyAllTabs = deepToRaw(allTabs.value)
  const index = allTabs.value.findIndex((t) => isEqual(t, modifiedTab))

  copyAllTabs[index].show_tab = value
  onChange(copyAllTabs)
}

const onDelete = (element: ProjectTab) => {
  selectTab.value = element
  openModals('delete')
}

const onEdit = (element: ProjectTab) => {
  selectTab.value = element
  openModals('edit')
}

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteProjectTab(props.project.id, selectTab.value.id)
    .then(() => fullRefresh())
    .then(() => {
      analytics.track('delete_project_tab', {
        project: props.project.id,
        tab: selectTab.value.id,
      })
      toaster.pushSuccess(t(`tab.toasts.tab-delete.success`))
    })
    .catch(() => toaster.pushError(t(`tab.toasts.tab-delete.error`)))
    .finally(() => clean())
}

// need to force sortable to reload list
const sortableKeys = computed(() =>
  allTabs.value.map((tab) => `${tab.id || tab.type}-${tab.order}`).join('::')
)
</script>

<template>
  <BaseModuleTab :title="project.$t.title">
    <FetchLoader :status="status" only-error skeleton>
      <FetchAsync :asyncing="asyncing || isLoading">
        <!-- actions -->
        <BaseModuleHeader @add="openModals('add')" />

        <Sortable
          :key="sortableKeys"
          :list="allTabs"
          :options="DRAG_OPTIONS"
          group="category-children"
          tag="transition-group"
          :item-key="(tab) => `${tab.id || tab.type}-${tab.order}`"
          @end="onDrag"
        >
          <template #item="{ element: tab }">
            <TemplateFormSection
              :visibility="tab.show_tab"
              :can-delete="isCustomTab(tab.type) && canCreateTab"
              :can-edit="canCreateTab"
              :content-expandable="false"
              :can-visibility="true"
              :title="tab.$t.title"
              :icon="tab.icon"
              class="sortable"
              :class="{
                'visibility-hide': !tab.show_tab,
              }"
              @update:visibility="onVisibilityChange(tab, $event)"
              @edit="onEdit(tab)"
              @delete="onDelete(tab)"
            >
              <template #left>
                <IconImage class="icon skeletons-background sortable-icon" name="DotsGrid" />
              </template>
              <template #right>
                <ContextActionMenuInline
                  class="context-actions"
                  show-empty
                  :can-delete="isCustomTab(tab.type) && canCreateTab"
                  :can-edit="canCreateTab"
                  @delete="onDelete(tab)"
                  @edit="onEdit(tab)"
                />
              </template>
              <TabFormRaw show-type :model-value="tab" />
            </TemplateFormSection>
          </template>
        </Sortable>
      </FetchAsync>

      <!-- drawer -->

      <ProjectAddiionalsCreateTab
        :is-opened="stateModals.add || stateModals.edit"
        :project="project"
        :tab="selectTab"
        :asyncing="asyncing"
        @close="clean"
        @refresh="onEditRefresh"
      />
    </FetchLoader>

    <ConfirmModal
      v-if="stateModals.delete"
      :title="$t('tab.tab.delete-confirm')"
      :asyncing="asyncing"
      @cancel="clean"
      @confirm="onDeleteConfirm"
    />
  </BaseModuleTab>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.context-actions {
  align-items: center;
  margin-left: 1rem;
}

.sortable {
  margin: 1rem 0;

  &.visibility-hide {
    opacity: 0.7;
  }

  .sortable-icon {
    cursor: grab !important;
  }
}
</style>
