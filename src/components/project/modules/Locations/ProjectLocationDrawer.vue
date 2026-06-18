<template>
  <LocationDrawer
    ref="drawer"
    :is-opened="isOpened"
    :locations="locations"
    :location-types="PROJECT_LOCATIONS_TYPES"
    @close="$emit('close')"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>

<script setup lang="ts">
import { postLocations, patchLocation, deleteLocation } from '@/api/locations.service'
import type { TranslatedLocation } from '@/models/location.model'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import type { TranslatedProject } from '@/models/project.model'
import { PROJECT_LOCATIONS_TYPES } from '~/functs/constants'
import useToasterStore from '@/stores/useToaster'
import analytics from '@/analytics'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    project: TranslatedProject
    locations: TranslatedLocation[]
  }>(),
  {
    isOpened: false,
  }
)

const emit = defineEmits<{
  close: []
  reload: []
}>()

const drawerRef = useTemplateRef('drawer')
const toaster = useToasterStore()
const { t } = useNuxtI18n()

const asyncing = ref(false)

const onCreate = async (form) => {
  try {
    asyncing.value = true
    await postLocations(props.project.id, form)

    analytics.location.addLocationMapPoint({
      project: {
        id: props.project.id,
      },
      location: form,
    })

    toaster.pushSuccess(t('toasts.location-create.success'))

    emit('reload')
    nextTick(() => drawerRef.value?.centerMap())
  } catch (error) {
    toaster.pushError(`${t('toasts.location-create.error')} (${error})`)
    console.error(error)
  } finally {
    emit('close')
    asyncing.value = false
  }
}

const onEdit = async (form) => {
  asyncing.value = true
  return patchLocation(props.project.id, form.id, form)
    .then(() => {
      analytics.location.updateLocationMapPoint({
        project: {
          id: props.project.id,
        },
        location: form,
      })

      toaster.pushSuccess(t('toasts.location-update.success'))

      emit('reload')
    })
    .catch((error) => {
      toaster.pushError(t('toasts.location-update.error'))
      console.error(error)
    })
    .finally(() => {
      emit('close')
      asyncing.value = false
    })
}

const onDelete = async (form) => {
  asyncing.value = true
  return deleteLocation(props.project.id, form.id)
    .then(() => {
      analytics.location.deleteLocationMapPoint({
        project: {
          id: props.project.id,
        },
        location: form,
      })
      toaster.pushSuccess(t('toasts.location-delete.success'))
      emit('reload')
      nextTick(() => drawerRef.value?.centerMap())
    })
    .catch((error) => {
      toaster.pushError(t('toasts.location-delete.error'))
      console.error(error)
    })
    .finally(() => {
      emit('close')
      asyncing.value = false
    })
}

const onSubmit = (form) => {
  const body = {
    ...form,
    project_id: props.project.id,
  }

  if (body.id) {
    return onEdit(body)
  } else {
    return onCreate(body)
  }
}

defineExpose({
  onSubmit,
  onDelete,
  onCreate,
  onEdit,
})
</script>
