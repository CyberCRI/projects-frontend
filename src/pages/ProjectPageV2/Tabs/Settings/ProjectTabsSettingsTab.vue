<script setup lang="ts">
import type {
  ProjectTab,
  ProjectTabForm,
  ProjectTabType,
  TranslatedProject,
} from 'shared-projects-frontend/models'
import ProjectAddiionalsCreateTab from '~/pages/ProjectPageV2/Tabs/Additionals/ProjectAddiionalsCreateTab.vue'
import { refreshProjectData, refreshProjectTabs } from '~/composables/project/refreshProject'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { defaultProjectTabSettings, userProjectTabSettings } from '~/form/project-tabs'
import PrivacyField from '~/components/profile/modules/Privacy/PrivacyField.vue'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { updateProjectTab } from 'shared-projects-frontend/apis'
import type { IconImageChoice } from '~/functs/IconImage'
import { PROJECT_TABS } from '~/functs/constants'
import { sortBy } from 'es-toolkit'

const props = defineProps<{
  project: TranslatedProject
}>()

const { t } = useNuxtI18n()
const toaster = useToaster()

const organizationCode = useOrganizationCode()

const {
  data: tabs,
  status,
  isSkeleton,
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
  }
)

const defaultLocaleForm = () => {
  const localForm = defaultProjectTabSettings()

  tabs.value.forEach((tab) => {
    if (tab.type in localForm) {
      localForm[tab.type] = tab.show_tab
    } else {
      localForm[tab.id] = tab.show_tab
    }
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
})

const asyncing = ref(false)
const fields = computed(() => {
  const newOption = (label, modelKey) => ({
    label: t(label),
    modelKey,
    options: [
      {
        label: t('profile.edit.privacy.options.pub'),
        iconName: 'Eye' satisfies IconImageChoice as IconImageChoice,
        value: true,
        rank: 0,
      },
      {
        label: t('profile.edit.privacy.options.hide'),
        iconName: 'EyeSlash' satisfies IconImageChoice as IconImageChoice,
        value: false,
        rank: 1,
      },
    ],
    hasIcon: true,
  })
  const defaultTabs = Object.entries(PROJECT_TABS).map(([modelKey, label]) =>
    newOption(label, modelKey)
  )

  const f = defaultProjectTabSettings()
  tabs.value.forEach((tab) => {
    if (tab.type in f) {
      // dot nothins
    } else {
      defaultTabs.push(newOption(tab.$t.title, tab.id))
    }
  })

  return sortBy(defaultTabs, ['label'])
})

const onSubmit = async (modelKey: ProjectTabType | ProjectTab['id'], value: boolean) => {
  form.value[modelKey] = value

  if (typeof modelKey === 'string') {
    return
  }

  const tabId = modelKey
  const body: ProjectTabForm = {
    show_tab: value,
  }

  asyncing.value = true
  updateProjectTab(props.project.id, tabId, body)
    .then(() => {
      toaster.pushSuccess(t('tab.toasts.tab-visibility.success'))
      refreshProjectData(props.project).then(() => refreshProjectTabs(props.project))
    })
    .catch(() => toaster.pushError(t('tab.toasts.tab-visibility.error')))
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
        <PrivacyField
          v-for="field in fields"
          :key="field.modelKey"
          v-model="form[field.modelKey]"
          :label="field.label"
          :options="field.options"
          :has-icon="true"
          @update:model-value="onSubmit(field.modelKey, $event)"
        />
      </FetchAsync>

      <!-- drawer -->

      <BaseDrawer title="" :is-opened="stateModals.add" @close="closeModals('add')">
        <ProjectAddiionalsCreateTab :project="project" />
      </BaseDrawer>
    </FetchLoader>
  </BaseModuleTab>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>
