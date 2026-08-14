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

const { form: formTab } = useProjectTabForm()
const { form: formTabItem } = useProjectTabItemForm()

const onSubmit = (form: ProjectTabForm) => {
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
      toaster.pushSuccess(t('tab.toasts.tab-create.success'))
      refreshProjectData(props.project)
        .then(() => refreshProjectTabs(props.project))
        .then(() => {
          gobals.uiIsLocked = false
          router.push({
            name: 'projectAdditionalsEdit',
            params: {
              slugOrId: props.project.slug || props.project.id,
              tabId: projectTab.id,
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

    <TabForm v-model="formTab" :asyncing="asyncing" :project="project" @submit="onSubmit">
      <!-- you can create description in create tabs only if type is text -->
      <template v-if="formTab.type === 'text'">
        <br />
        <Title :title="$t('tab.item.create')" />
        <TabItemFormRaw v-model="formTabItem" />
      </template>
    </TabForm>
  </BaseModuleTab>
</template>
