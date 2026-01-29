<template>
  <LocationForm
    v-model="form"
    :loading="asyncing"
    @submit="submit"
    @close="$emit('close')"
    @delete="onDeleteLocation"
  />
</template>

<script setup lang="ts">
import analytics from '@/analytics'
import { postLocations, patchLocation, deleteLocation } from '@/api/locations.services'
import useToasterStore from '@/stores/useToaster'
import { ProjectLocationForm, LocationOutput, TranslatedLocation } from '@/models/location.model'
import LocationForm from '@/components/map/LocationForm.vue'

const props = withDefaults(
  defineProps<{
    locationToBeEdited?: TranslatedLocation
    newCoordinates?: any[]
    projectId: string
    address?: string
  }>(),
  {
    locationToBeEdited: null,
    newCoordinates: () => [],
    address: null,
  }
)

const emit = defineEmits<{
  close: []
  'center-map': []
  'location-edited': [LocationOutput]
  'location-created': [LocationOutput]
  'location-deleted': []
}>()

const toaster = useToasterStore()
const { t } = useNuxtI18n()

const asyncing = ref(false)
const form = ref<ProjectLocationForm>({
  project_id: props.projectId,
})

onBeforeMount(() => {
  if (props.locationToBeEdited) {
    form.value = {
      ...form.value,
      id: props.locationToBeEdited.id,
      lat: props.locationToBeEdited.lat,
      lng: props.locationToBeEdited.lng,
      description: props.locationToBeEdited.description,
      type: props.locationToBeEdited.type,
      title: props.locationToBeEdited.title,
    }
  }
  if (props.newCoordinates.length) {
    form.value.lat = props.newCoordinates[0]
    form.value.lng = props.newCoordinates[1]
  }
  if (props.address && !form.value.description) {
    form.value.description = props.address
  }
})

const onAddLocation = async () => {
  try {
    asyncing.value = true
    const body = {
      ...form.value,
      project_id: props.projectId,
    }
    const result = await postLocations(props.projectId, body)

    analytics.location.addLocationMapPoint({
      project: {
        id: props.projectId,
      },
      location: body,
    })

    toaster.pushSuccess(t('toasts.location-create.success'))

    emit('location-created', result)
    nextTick(() => emit('center-map'))
  } catch (error) {
    toaster.pushError(`${t('toasts.location-create.error')} (${error})`)
    console.error(error)
  } finally {
    emit('close')
    asyncing.value = false
  }
}

const onEditLocation = async () => {
  try {
    asyncing.value = true
    const result = await patchLocation(props.projectId, props.locationToBeEdited.id, form.value)

    analytics.location.updateLocationMapPoint({
      project: {
        id: props.projectId,
      },
      location: form.value,
    })

    toaster.pushSuccess(t('toasts.location-update.success'))

    emit('location-edited', result)
  } catch (error) {
    toaster.pushError(`${t('toasts.location-update.error')} (${error})`)
    console.error(error)
  } finally {
    emit('close')
    asyncing.value = false
  }
}

const onDeleteLocation = async () => {
  try {
    asyncing.value = true
    await deleteLocation(props.projectId, props.locationToBeEdited.id)

    analytics.location.deleteLocationMapPoint({
      project: {
        id: props.projectId,
      },
      location: form.value,
    })

    toaster.pushSuccess(t('toasts.location-delete.success'))

    emit('location-deleted')
    nextTick(() => emit('center-map'))
  } catch (error) {
    toaster.pushError(`${t('toasts.location-delete.error')} (${error})`)
    console.error(error)
  } finally {
    emit('close')
    asyncing.value = true
  }
}

const submit = () => {
  if (props.locationToBeEdited) {
    onEditLocation()
  } else {
    onAddLocation()
  }
}
</script>

<style lang="scss" scoped>
.new-coords {
  text-align: center;
  font-style: italic;
  font-weight: normal;
}

.description-input {
  margin-top: $space-m;
}

.location-type-ctn {
  margin: $space-m 0;

  .location-type-label {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: bold;
    margin-bottom: $space-2xs;
  }
}

.delete-button {
  color: $white;
  background: $salmon;
}
</style>
