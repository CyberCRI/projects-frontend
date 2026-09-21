<script setup lang="ts">
import type {
  ProjectTab,
  ProjectTabForm,
  ProjectTabType,
  TranslatedProject,
} from 'shared-projects-frontend/models'
import ProjectAddiionalsCreateTab from '~/pages/ProjectPageV2/Tabs/Additionals/ProjectAddiionalsCreateTab.vue'
import { refreshProjectData, refreshProjectTabs } from '~/composables/project/refreshProject'
import { defaultProjectTabSettings, userProjectTabSettings } from '~/form/project-tabs'
import { createProjectTab, updateProjectTab } from 'shared-projects-frontend/apis'
import GroupButtonField from '~/components/base/form/GroupButtonField.vue'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { defaultTab, getTab, sanitizeTabs } from '~/functs/tabs'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { IconImageChoice } from '~/functs/IconImage'
import { Sortable } from 'sortablejs-vue3'
import { deepToRaw } from '~/functs/utils'

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
  refresh,
} = getAllProjectTab(
  organizationCode,
  computed(() => props.project.id),
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
  () => [tabs.value],
  () => {
    if (!isSkeleton.value) {
      reset(defaultLocaleForm())
    }
  },
  { immediate: true, deep: true }
)

const { stateModals, openModals, closeModals } = useModals({
  add: false,
  edit: false,
})

const fullRefresh = () => {
  refresh()
  closeModals('edit', 'add')
}

const asyncing = ref(false)
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
    return createProjectTab(props.project.id, {
      ...defaultTab(modelKey),
      order: 0,
      ...form,
    })
  }

  asyncing.value = true
  return updateProjectTab(props.project.id, modelKey, form)
    .then(() => {
      toaster.pushSuccess(t('tab.toasts.tab-visibility.success'))
      refreshProjectData(props.project).then(() => refreshProjectTabs(props.project))
    })
    .catch(() => toaster.pushError(t('tab.toasts.tab-visibility.error')))
    .then(() => {
      asyncing.value = false
    })
}

const onSubmit = async (modelKey: ProjectTabType | ProjectTab['id'], value: boolean) => {
  form.value[modelKey] = value
  const body: ProjectTabForm = {
    show_tab: value,
  }

  asyncing.value = true
  onUpdateOrCreate(modelKey, body)
    .then(() => {
      toaster.pushSuccess(t('tab.toasts.tab-visibility.success'))
      refreshProjectData(props.project).then(() => refreshProjectTabs(props.project))
    })
    .catch(() => toaster.pushError(t('tab.toasts.tab-visibility.error')))
    .then(() => {
      asyncing.value = false
    })
}

const selectTab = ref(null)
const onDelete = (element: ProjectTabType | ProjectTab['id']) => {
  selectTab.value = element
}
const onEdit = (element: ProjectTabType | ProjectTab['id']) => {
  selectTab.value = getTab(tabs.value, element) || defaultTab(element as ProjectTabType)
  openModals('edit')
}

const onDrag = (ev) => {
  const { oldIndex, newIndex } = ev

  let subTabs = deepToRaw(allTabs.value)
  const item = subTabs[oldIndex]
  subTabs.splice(newIndex, 0, { ...item })
  subTabs = subTabs
    .filter((tab) => tab !== item)
    .filter((tab, idx) => {
      if (tab.order === idx) {
        return false
      }
      tab.order = idx
      return true
    })

  if (subTabs.length === 0) {
    return
  }

  asyncing.value = true
  Promise.all(
    subTabs.map((item) =>
      onUpdateOrCreate(item.id || item.type, {
        order: item.order,
      })
    )
  )
    .then(() => {
      toaster.pushSuccess(t('tab.toasts.tab-order.success'))
      refreshProjectData(props.project)
        .then(() => refreshProjectTabs(props.project))
        .then(() => refresh())
    })
    .catch(() => toaster.pushError(t('tab.toasts.tab-order.error')))
    .then(() => {
      asyncing.value = false
    })
}
</script>

<template>
  <BaseModuleTab :title="project.$t.title">
    <FetchLoader :status="status" :with-data="!isSkeleton">
      <BaseModuleHeader @add="openModals('add')" />
      <!-- actions -->
      <FetchAsync :asyncing="asyncing">
        <Sortable
          :list="fields"
          :options="DRAG_OPTIONS"
          group="category-children"
          tag="transition-group"
          item-key="modelKey"
          @end="onDrag"
        >
          <template #item="{ element }">
            <div :key="element.modelKey" class="item-draggable">
              <GroupButtonField
                v-model="form[element.modelKey]"
                :label="element.label"
                :options="element.options"
                :has-icon="true"
                @update:model-value="onSubmit(element.modelKey, $event)"
              >
                <template #label-left>
                  <IconImage class="icon" name="DotsGrid" />
                </template>
                <template #actions-right>
                  <ContextActionMenuInline
                    class="context-actions"
                    :can-delete="canDeleteTab"
                    :can-edit="canDeleteEdit"
                    @delete="onDelete(element.modelKey)"
                    @edit="onEdit(element.modelKey)"
                  />
                </template>
              </GroupButtonField>
            </div>
          </template>
        </Sortable>
      </FetchAsync>

      <!-- drawer -->

      <ProjectAddiionalsCreateTab
        :is-opened="stateModals.edit || stateModals.add"
        :project="project"
        :tab="selectTab"
        @close="closeModals('edit', 'add')"
        @refresh="fullRefresh()"
      />
    </FetchLoader>
  </BaseModuleTab>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.context-actions {
  align-items: center;
  margin-left: 1rem;
}

.item-draggable {
  // display: grid;
  // grid-template-columns: auto 1fr;
}
</style>
