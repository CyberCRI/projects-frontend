<template>
  <DialogModal
    :confirm-button-label="locationToBeEdited ? $t('common.edit') : $t('common.add')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="asyncing"
    @close="$emit('close')"
    @submit="submit"
  >
    <template #header>
      {{
        locationToBeEdited ? $t('project.edit-location-point') : $t('project.add-location-point')
      }}
    </template>

    <template #body>
      <div class="location-type-ctn">
        <div class="location-type-label">
          {{ $t('project.location-type-label') }}
        </div>
        <GroupButton v-model="form.type" :options="locationTypeOptions" />
      </div>

      <TextInput v-model="form.title" :label="$t('common.title')" />

      <TextInput
        v-model="form.description"
        input-type="textarea"
        :label="$t('common.description')"
        class="description-input"
      />
    </template>

    <template v-if="locationToBeEdited" #extra-buttons>
      <LpiButton
        class="delete-button"
        :disabled="asyncing"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        :label="$t('common.delete')"
        @click="onDeleteLocation"
      />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '@/components/base/modal/DialogModal.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import analytics from '@/analytics'
import { postLocations, patchLocation, deleteLocation } from '@/api/locations.services'
import useToasterStore from '@/stores/useToaster'
import LpiButton from '@/components/base/button/LpiButton.vue'
import { LocationOutput, TranslatedLocation } from '@/models/location.model'
import { LocationType } from '@/models/types'

const props = withDefaults(
  defineProps<{
    locationToBeEdited?: TranslatedLocation
    newCoordinates?: any[]
    projectId?: string
    address?: string
  }>(),
  {
    locationToBeEdited: null,
    newCoordinates: () => [],
    address: null,
    projectId: null,
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
const form = ref({
  type: 'team' as LocationType,
  title: '',
  description: '',
  lat: null,
  lng: null,
})

const locationTypeOptions = computed(() => [
  {
    value: 'team',
    label: t('team.team'),
  },
  {
    value: 'impact',
    label: t('project.impact'),
  },
  {
    value: 'address',
    label: t('geocoding.address'),
  },
])

onBeforeMount(() => {
  if (props.locationToBeEdited) {
    form.value = {
      lat: props.locationToBeEdited.lat,
      lng: props.locationToBeEdited.lng,
      description: props.locationToBeEdited.description,
      type: props.locationToBeEdited.type,
      title: props.locationToBeEdited.title,
    }
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
      lat: props.newCoordinates[0],
      lng: props.newCoordinates[1],
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
      location: result,
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
