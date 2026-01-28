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
        @click="deleteLocation"
      />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '@/components/base/modal/DialogModal.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

const props = withDefaults(
  defineProps<{
    locationToBeEdited?: any
    newCoordinates?: any[]
    address?: string
  }>(),
  {
    locationToBeEdited: null,
    newCoordinates: () => [],
    address: null,
  }
)

defineEmits<{
  close: []
  'center-map': []
  'location-edited': []
  'location-created': []
  'location-delete': []
}>()

const asyncing = ref(false)
const form = ref({
  type: 'team',
  title: '',
  description: '',
})

const { t } = useNuxtI18n()

const locationTypeOptions = computed(() => {
  return [
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
  ]
})

onBeforeMount(() => {
  if (props.locationToBeEdited) {
    form.value = { ...props.locationToBeEdited }
  }
  if (props.address && !form.value.description) {
    form.value.description = props.address
  }
})

const editLocation = () => {}
const addLocation = () => {
  void props.newCoordinates
  // const location = {
  //   ...form.value,
  //   lat: props.newCoordinates[0],
  //   lng: props.newCoordinates[1],
  // }
}
const deleteLocation = () => {}

const submit = () => {
  if (props.locationToBeEdited) {
    editLocation()
  } else {
    addLocation()
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
