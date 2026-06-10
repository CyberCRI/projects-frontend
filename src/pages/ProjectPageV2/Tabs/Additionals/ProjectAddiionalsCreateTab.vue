<script setup lang="ts">
import { refreshProjectData, refreshProjectTabs } from '~/composables/project/refreshProject'
import type { ProjectTabForm } from '~/models/projects-tabs.model'
import type { TranslatedProject } from '~/models/project.model'
import { createProjectTab } from '~/api/project-tabs.service'
import TabForm from '~/components/tabs/TabForm.vue'

const props = defineProps<{
  project: TranslatedProject
}>()

const toaster = useToaster()
const { t } = useNuxtI18n()
const router = useRouter()

const asyncing = ref(false)

const gobals = useGlobals()

const onSubmit = (form: ProjectTabForm) => {
  asyncing.value = true

  createProjectTab(props.project.id, form)
    .then((projectTab) => {
      toaster.pushSuccess(t('tab.toast.created.success'))
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
    .catch(() => toaster.pushError(t('tab.toast.created.error')))
    .then(() => {
      asyncing.value = false
    })
}
</script>

<template>
  <BaseModuleTab :title="$t('tab.title')">
    <TabForm :asyncing="asyncing" :project="project" @submit="onSubmit" />
  </BaseModuleTab>
</template>
