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
import { defaultProjectTabSettings, userProjectTabSettings } from '~/form/project-tabs'
import GroupButtonField from '~/components/base/form/GroupButtonField.vue'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { IconImageChoice } from '~/functs/IconImage'
import { defaultTab, sanitizeTabs } from '~/functs/tabs'
import { debounce, isEqual } from 'es-toolkit'
import { Sortable } from 'sortablejs-vue3'
import { deepToRaw } from '~/functs/utils'
import analytics from '~/analytics'

const props = defineProps<{
  project: TranslatedProject
}>()

const { t } = useNuxtI18n()
const toaster = useToaster()

const organizationCode = useOrganizationCode()

const canDeleteTab = true
const canDeleteEdit = true

const {
  data: tabs,
  status,
  isSkeleton,
} = getAllProjectTab(
  organizationCode,
  computed(() => props.project.slug || props.project.id),
  {
    paginationConfig: {
      limit: 999,
    },
    query: {
      modules: 'none',
    },
    default: () => factoryPagination(projectTabSkeleton, 0, 0),
    uniqueKey: 'settings',
  }
)
const allTabs = computed(() => sanitizeTabs(tabs.value, props.project.modules))

// sortable
const DRAG_OPTIONS = {
  animation: 200,
  disabled: false,
  ghostClass: 'child-ghost',
}

const defaultLocaleForm = () => {
  const localForm = defaultProjectTabSettings()

  allTabs.value.forEach((tab) => {
    localForm[tab.id || tab.type] = tab.show_tab
  })

  return localForm
}

const { form, reset } = userProjectTabSettings()

watch(
  () => [allTabs.value, isSkeleton.value],
  debounce(() => {
    if (!isSkeleton.value) {
      reset(defaultLocaleForm())
    }
  }, 300),
  { immediate: true, deep: true }
)

const { stateModals, openModals, closeAllModals } = useModals({
  add: false,
  edit: false,
  delete: false,
})

const fullRefresh = () => {
  return refreshProjectData(props.project).then(() => refreshProjectTabs(props.project))
}

const selectTab = ref<ProjectTab>(null)
const asyncing = ref(false)
const clean = () => {
  selectTab.value = null
  asyncing.value = false
  closeAllModals()
}

const fields = computed(() => {
  const newOption = (tab) => ({
    label: tab.$t.title,
    modelKey: tab.id || tab.type,
    tab,
    options: [
      {
        label: t('tab.form.show_tab.show'),
        iconName: 'Eye' satisfies IconImageChoice as IconImageChoice,
        value: true,
        rank: 0,
      },
      {
        label: t('tab.form.show_tab.hide'),
        iconName: 'EyeSlash' satisfies IconImageChoice as IconImageChoice,
        value: false,
        rank: 1,
      },
    ],
    hasIcon: true,
  })
  return allTabs.value.map((tab) => newOption(tab))
})

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

const onVisibilityChange = (modelKey: ProjectTabType | ProjectTab['id'], value: boolean) => {
  asyncing.value = true

  form.value[modelKey] = value
  const copyAllTabs = deepToRaw(allTabs.value)
  copyAllTabs.forEach((tab) => {
    console.log(tab.id, tab.type, modelKey)
    if (tab.id === modelKey || tab.type === modelKey) {
      console.log('set', value)
      tab.show_tab = value
    }
  })

  onChange(copyAllTabs)
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
</script>

<template>
  <BaseModuleTab :title="project.$t.title">
    <FetchLoader :status="status" :with-data="!isSkeleton">
      <FetchAsync :asyncing="asyncing">
        <!-- actions -->
        <BaseModuleHeader @add="openModals('add')" />
        <Sortable
          :list="fields"
          :options="DRAG_OPTIONS"
          group="category-children"
          tag="transition-group"
          item-key="modelKey"
          @end="onDrag"
        >
          <template #item="{ element }">
            <GroupButtonField
              :key="element.modelKey"
              v-model="form[element.modelKey]"
              :label="element.label"
              :options="element.options"
              :has-icon="true"
              class="sortable"
              :class="{
                asyncing,
              }"
              @update:model-value="onVisibilityChange(element.modelKey, $event)"
            >
              <template #label-left>
                <IconImage class="icon skeletons-background" name="DotsGrid" />
              </template>
              <template #actions-right>
                <ContextActionMenuInline
                  class="context-actions"
                  show-empty
                  :can-delete="['text', 'blog'].includes(element.tab.type) && canDeleteTab"
                  :can-edit="canDeleteEdit"
                  @delete="onDelete(element.tab)"
                  @edit="onEdit(element.tab)"
                />
              </template>
            </GroupButtonField>
          </template>
        </Sortable>
      </FetchAsync>

      <!-- drawer -->

      <ProjectAddiionalsCreateTab
        :is-opened="stateModals.edit || stateModals.add"
        :project="project"
        :tab="selectTab"
        :asyncing="asyncing"
        @close="clean"
        @refresh="fullRefresh().then(() => clean())"
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
  &.asyncing {
    cursor: wait !important;
  }

  &:not(.asyncing, .child-ghost) {
    cursor: grab !important;
  }

  &.child-ghost {
    cursor: move !important;
  }
}
</style>
