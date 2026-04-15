<template>
  <SdgsDrawer
    v-model="selection"
    :is-opened="isOpened"
    :asyncing="asyncing"
    @close="close"
    @confirm="saveSdgs"
  />
</template>

<script setup lang="ts">
import { patchProject } from '@/api/projects.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster'
import SdgsDrawer from '@/components/sdgs/SdgsDrawer.vue'
import { ProjectModel } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project?: ProjectModel
    isOpened?: boolean
    sdgs?: number[]
  }>(),
  {
    project: null,
    isOpened: false,
    sdgs: () => [],
  }
)

const emit = defineEmits<{
  'reload-sdgs': []
  close: []
}>()

const toaster = useToasterStore()

const asyncing = ref(false)
const selection = ref<number[]>([])

const { t } = useNuxtI18n()

watch(
  () => props.isOpened,
  () => {
    if (props.isOpened) {
      selection.value = [...props.sdgs]
    }
  }
)

const saveSdgs = async () => {
  asyncing.value = true
  const sdgs = selection.value
  try {
    await patchProject(props.project.id, { sdgs })

    analytics.goal.updateSDG(
      props.project.id,
      sdgs.map((sdg) => ({
        id: sdg,
        title: t(`sdg.${sdg}.title`),
      }))
    )

    emit('reload-sdgs')

    toaster.pushSuccess(t('toasts.sdgs-update.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.sdgs-update.error')} (${error})`)
    console.error(error)
  } finally {
    emit('close')
    asyncing.value = false
  }
}

const close = () => {
  if (asyncing.value) return
  emit('close')
}
</script>
