<template>
  <DialogModal
    :confirm-button-label="isExist ? $t('common.edit') : $t('common.add')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="loading"
    :disabled="loading || !isValid"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <template #header>
      {{ isExist ? $t('location.edit-location-point') : $t('location.add-location-point') }}
    </template>

    <template #body>
      <div class="location-map-ctn">
        <!-- form not have it, so ignore typescript -->
        <MapRecap :locations="[form as any]" :expand="false" />
      </div>

      <div class="location-type-ctn">
        <div class="location-type-label">
          {{ $t('location.location-type-label') }}
        </div>
        <GroupButton v-model="form.type" :options="locationTypeOptions" />
      </div>
      <TextInput v-model="form.title" :errors="errors.title" :label="$t('common.title')" />

      <TextInput
        v-model="form.description"
        :errors="errors.description"
        input-type="textarea"
        :label="$t('common.description')"
        class="description-input"
      />
    </template>

    <template #extra-buttons>
      <LpiButton
        class="delete-button"
        :label="$t('common.delete')"
        :btn-icon="loading ? 'LoaderSimple' : null"
        @click="$emit('delete')"
      />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import type { LocationForm } from '~/models/location.model'
import type { LocationType } from '~/models/types'

import GroupButton from '~/components/base/button/GroupButton.vue'
import DialogModal from '~/components/base/modal/DialogModal.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import MapRecap from '~/components/map/MapRecap.vue'

import { useLocationForm } from '~/form/location'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    locationTypes?: LocationType[]
  }>(),
  {
    loading: false,
    locationTypes: null,
  }
)
defineEmits(['submit', 'close', 'delete'])
const { t } = useNuxtI18n()

const locationTypeOptions = computed(() => {
  const arr: { value: LocationType; label: string }[] = [
    {
      value: 'team',
      label: t('location.team'),
    },
    {
      value: 'impact',
      label: t('location.impact'),
    },
    {
      value: 'address',
      label: t('location.address'),
    },
    {
      value: 'news',
      label: t('location.news'),
    },
    {
      value: 'event',
      label: t('location.event'),
    },
  ]
  if (props.locationTypes) {
    return arr.filter(({ value }) => props.locationTypes.includes(value))
  }
  return arr
})

const defaultLocationType = computed<LocationType>(() => {
  if (!props.locationTypes || props.locationTypes.includes('address')) {
    return 'address'
  }
  return props.locationTypes.at(0)
})

const model = defineModel<LocationForm>()

const { form, isValid, errors } = useLocationForm({ model })

// safe guard for not locationsType exists
watch(
  () => form.value.type,
  () => {
    if (!form.value.type || !props.locationTypes?.includes(form.value.type)) {
      form.value.type = defaultLocationType.value
    }
  },
  { immediate: true }
)

const isExist = computed(() => !!form.value.id)
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
  border-color: $salmon;
  background: $salmon;
}
</style>

<style>
.location-map-ctn .map-recap {
  height: 250px;
}
</style>
