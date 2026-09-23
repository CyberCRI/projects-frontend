<script setup lang="ts">
import { refreshProjectData, refreshProjectTabs } from '~/composables/project/refreshProject'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import type { TranslatedProject, ProjectTabForm } from 'shared-projects-frontend/models'
import { createProjectTab, createProjectTabItem } from 'shared-projects-frontend/apis'
import { useProjectTabForm, useProjectTabItemForm } from '~/form/project-tabs'
import { usePermissions } from '~/composables/usePermissions/usePermissions'
import TabItemFormRaw from '~/components/tabs/TabItemFormRaw.vue'
import TabForm from '~/components/tabs/TabForm.vue'
import Title from '~/components/base/Title.vue'
import analytics from '~/analytics'

const props = defineProps<{
  project: TranslatedProject
}>()

const toaster = useToaster()
const { t } = useNuxtI18n()
const router = useRouter()

const asyncing = ref(false)
const gobals = useGlobals()

const { form: formTab, validate: validateTab } = useProjectTabForm()
const { form: formTabItem, validate: validatTabItem } = useProjectTabItemForm()

const onSubmit = async (form: ProjectTabForm) => {
  if (!(await validateTab()) || !(await validatTabItem())) {
    return
  }

const tabFormRawRef = useTemplateRef('tabFormRawRef')
const tabItemFormRawRef = useTemplateRef('tabItemFormRawRef')

const resetAllToInitial = () => {
  tabFormRawRef.value?.resetToInitialValue()
  tabItemFormRawRef.value?.resetToInitialValue()
}

const formExtraIsEqual = computed(
  () =>
    formTab.value.type !== 'text' ||
    !tabItemFormRawRef.value ||
    tabItemFormRawRef.value.isFormEqual()
)

const onSubmit = async (form: ProjectTabForm) => {
  // exposed ref are automagicalyy unwrapped
  if (!(await tabFormRawRef.value?.v$.$validate())) {
    tabFormRawRef.value?.jumpToFirstError()
    return
  } else if (form.type === 'text') {
    // exposed ref are automagicalyy unwrapped
    if (!(await tabItemFormRawRef.value?.v$.$validate())) {
      tabItemFormRawRef.value?.jumpToFirstError()
      return
    }
  }
  asyncing.value = true

  createProjectTab(props.project.id, form)
    .then((projectTab) => {
      analytics.track('create_project_tab', {
        project: props.project.id,
        tab: projectTab.id,
      })
      return projectTab
    })
    .then((projectTab) => {
      // ignore blog creations
      if (projectTab.type === 'blog') {
        return projectTab
      }
      return createProjectTabItem(props.project.id, projectTab.id, formTabItem.value)
        .catch(() => {
          toaster.pushError(t('tab.toasts.item-create.error'))
        })
        .then(() => projectTab)
    })
    .then((projectTab) => {
      resetAllToInitial()
      toaster.pushSuccess(t('tab.toasts.tab-create.success'))
      refreshProjectData(props.project)
        .then(() => refreshProjectTabs(props.project))
        .then(() => {
          gobals.uiIsLocked = false
          router.push({
            name: 'projectAdditionalsEdit',
            params: {
              slugOrId: props.project.slug || props.project.id,
              tabId: projectTab.slug || projectTab.id,
            },
          })
        })
    })
    .catch(() => toaster.pushError(t('tab.toasts.tab-create.error')))
    .then(() => {
      asyncing.value = false
    })
}

const { isAdmin } = usePermissions()
const { canCreateTab } = usePermissionProject(
  computed(() => props.project.id),
  computed(() => props.project)
)

watchEffect(() => {
  if (!canCreateTab.value && !isAdmin.value) {
    toaster.pushError(t('message.error.unauthorized'))
    router.push({
      name: 'ProjectSnapshot',
      params: {
        slugOrId: props.project.slug || props.project.id,
      },
    })
  }
})
</script>

<template>
  <BaseModuleTab :title="$t('tab.tab.title')">
    <!-- show message when creation is only enable when you are admin -->
    <LpiSnackbar v-if="!canCreateTab && isAdmin" icon="AlertOutline" type="warning">
      {{ $t('tab.tab.not-enabled.admin') }}
    </LpiSnackbar>

    <TabForm
      ref="tabFormRawRef"
      v-model="formTab"
      :asyncing="asyncing"
      :project="project"
      :form-extra-is-equal="formExtraIsEqual"
      @submit="onSubmit"
      @cancel="resetAllToInitial"
    >
      <!-- you can create description in create tabs only if type is text -->
      <template v-if="formTab.type === 'text'">
        <br />
        <Title :title="$t('tab.item.create')" />
        <TabItemFormRaw ref="tabItemFormRawRef" v-model="formTabItem" />
      </template>
    </TabForm>
  </BaseModuleTab>
</template>
