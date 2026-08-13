<script setup lang="ts">
import { refreshProjectData, refreshProjectTabs } from '~/composables/project/refreshProject'
import type { TranslatedProject, ProjectTabForm } from 'shared-projects-frontend/models'
import { createProjectTab, createProjectTabItem } from 'shared-projects-frontend/apis'
import { useProjectTabForm, useProjectTabItemForm } from '~/form/project-tabs'
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
</script>

<template>
  <BaseModuleTab :title="$t('tab.tab.title')">
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
