<template>
  <LocationDrawer
    ref="drawer"
    :is-opened="isOpened"
    :locations="locations"
    @close="$emit('close')"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>

<script setup lang="ts">
import analytics from '@/analytics'
import { postLocations, patchLocation, deleteLocation } from '@/api/locations.services'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import { TranslatedLocation } from '@/models/location.model'
import { TranslatedProject } from '@/models/project.model'
import useToasterStore from '@/stores/useToaster'

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
  try {
    asyncing.value = true
    await patchLocation(props.project.id, form.id, form)

    analytics.location.updateLocationMapPoint({
      project: {
        id: props.project.id,
      },
      location: form,
    })

    toaster.pushSuccess(t('toasts.location-update.success'))

    emit('reload')
  } catch (error) {
    toaster.pushError(`${t('toasts.location-update.error')} (${error})`)
    console.error(error)
  } finally {
    emit('close')
    asyncing.value = false
  }
}

const onDelete = async (form) => {
  try {
    asyncing.value = true
    await deleteLocation(props.project.id, form.id)

    analytics.location.deleteLocationMapPoint({
      project: {
        id: props.project.id,
      },
      location: form,
    })

    toaster.pushSuccess(t('toasts.location-delete.success'))

    emit('reload')
    nextTick(() => drawerRef.value?.centerMap())
  } catch (error) {
    toaster.pushError(`${t('toasts.location-delete.error')} (${error})`)
    console.error(error)
  } finally {
    emit('close')
    asyncing.value = false
  }
}

const onSubmit = (form) => {
  const body = {
    ...form,
    project_id: props.project.id,
  }

  if (body.id) {
    onEdit(body)
  } else {
    onCreate(body)
  }
}
</script>
