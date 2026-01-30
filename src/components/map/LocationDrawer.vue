<template>
  <div>
    <BaseDrawer
      no-footer
      :is-opened="isOpened"
      :title="editable ? $t('location.edit-map') : $t('location.map')"
      :confirm-action-name="$t('common.save')"
      @close="$emit('close')"
      @confirm="$emit('close')"
    >
      <div v-if="editable" class="top">
        <div v-if="!formMode">
          <p v-if="GEOCODING_ENABLED" class="notice">{{ $t('geocoding.choose-method') }}</p>
          <div class="buttons-line">
            <LpiButton
              :label="
                $t(
                  GEOCODING_ENABLED
                    ? 'geocoding.click-method'
                    : 'geocoding.click-method-no-geocoding'
                )
              "
              @click="formMode = 'click'"
            />
            <LpiButton
              v-if="GEOCODING_ENABLED"
              :label="$t('geocoding.form-method')"
              @click="formMode = 'form'"
            />
            <LpiButton
              :label="$t('geocoding.current-position')"
              btn-icon="CurrentPosition"
              @click="currentPosition"
            />
          </div>
        </div>
        <div v-else-if="formMode === 'click'">
          <p class="notice">{{ $t('geocoding.click-method-notice') }}</p>
          <div class="buttons-line">
            <LpiButton :label="$t('common.cancel')" @click="formMode = null" />
          </div>
        </div>
        <div v-else-if="formMode === 'form'">
          <div v-if="!suggestedLocations || !suggestedLocations.length">
            <div class="input-field">
              <TextInput
                v-model="searchAddress"
                autofocus
                :placeholder="$t('geocoding.form-placeholder')"
                :label="$t('geocoding.form-method-notice')"
                @keyup.enter="!!searchAddress && suggestLocations()"
              />
            </div>
            <p v-if="suggestedLocations && !suggestedLocations.length" class="notice">
              {{ $t('geocoding.no-results') }}
            </p>
            <div class="buttons-line">
              <LpiButton
                :label="$t('common.cancel')"
                :disabled="geocodingLoading"
                :btn-icon="geocodingLoading ? 'LoaderSimple' : null"
                @click="formMode = null"
              />
              <LpiButton
                :disabled="!searchAddress || geocodingLoading"
                :label="$t('geocoding.search')"
                :btn-icon="geocodingLoading ? 'LoaderSimple' : null"
                @click="suggestLocations"
              />
            </div>
          </div>
          <div v-else>
            <p class="notice">
              {{ $t('geocoding.found-number', { number: suggestedLocations.length }) }}
            </p>
            <p class="notice">{{ $t('geocoding.pick-location') }}</p>

            <div class="buttons-line">
              <LpiButton :label="$t('common.cancel')" @click="suggestedLocations = null" />
            </div>
          </div>
        </div>
      </div>

      <div class="full-screen-map-ctn location-map-ctn">
        <div class="map-inner-ctn">
          <div class="map">
            <client-only>
              <LazyBaseMap ref="map" @click="formMode === 'click' ? openAddModal($event) : null">
                <template #default="slotProps">
                  <template v-if="slotProps.map && !suggestedLocations">
                    <MapPointer
                      v-for="location in locations"
                      :key="location.id"
                      :editable="editable"
                      :location="location"
                      @edit="openEditModal"
                      @mounted="slotProps.addPointer($event, {})"
                      @unmounted="slotProps.removePointer(location)"
                    >
                      <LocationTooltip
                        v-if="location.title || location.description"
                        :location="location"
                      />
                    </MapPointer>
                  </template>
                  <template v-if="slotProps.map && suggestedLocations">
                    <MapSuggestion
                      v-for="location in suggestedLocations"
                      :key="location.id"
                      :location="location"
                      @pick-location="openAddModal"
                      @mounted="slotProps.addPointer($event, {})"
                      @unmounted="slotProps.removePointer(location)"
                    />
                  </template>
                </template>
              </LazyBaseMap>
            </client-only>
          </div>
        </div>
      </div>
    </BaseDrawer>

    <LocationForm
      v-if="editable && showForm"
      v-model="form"
      :location-types="locationTypes"
      @close="closeModal"
      @submit="onSubmit"
      @delete="onDelete(form)"
    />

    <ConfirmModal
      v-if="editable && locationToDelete"
      :title="$t('geocoding.delete-location')"
      :content="$t('geocoding.confirm-delete-location')"
      @cancel="locationToDelete = null"
      @confirm="onDelete(locationToDelete)"
    />
  </div>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import useToasterStore from '@/stores/useToaster'
import { LocationForm as LocationFormType, TranslatedLocation } from '@/models/location.model'
import LocationTooltip from '@/components/map/LocationTooltip.vue'
import { Geocoding } from '@/interfaces/maps'
import { useSuggestLocations } from '@/api/geocoding.service'
import LocationForm from '@/components/map/LocationForm.vue'
import { LocationType } from '@/models/types'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    locations?: TranslatedLocation[]
    editable?: boolean
    locationTypes?: LocationType[]
  }>(),
  {
    isOpened: false,
    editable: false,
    locations: () => [],
    locationTypes: null,
  }
)

const emit = defineEmits<{
  close: []
  submit: [LocationFormType]
  delete: [LocationFormType]
}>()

const toaster = useToasterStore()
const runtimeConfig = useRuntimeConfig()
const GEOCODING_ENABLED = !!runtimeConfig.public.appGeocodingApiUrl

const { locale, t } = useNuxtI18n()

const searchAddress = ref('')
const locationToDelete = ref(null)
const geocodingLoading = ref(false)
const showForm = ref(false)

const mapRef = useTemplateRef('map')
const centerMap = () => mapRef.value?.centerMap()

defineExpose({
  centerMap,
})

const formMode = ref<'click' | 'form'>()
const form = ref(null)

const openEditModal = (location) => {
  form.value = location
  showForm.value = true
}
const openAddModal = (event) => openEditModal({ lat: event.latlng.lat, lng: event.latlng.lng })
const closeModal = () => {
  formMode.value = null
  form.value = null
  showForm.value = false
}

watch(
  () => props.isOpened,
  () => closeModal()
)

const suggestedLocations = ref<Geocoding[]>(null)

const currentPosition = async () => {
  navigator.geolocation.getCurrentPosition(
    (postiion) => {
      openEditModal({
        lat: postiion.coords.latitude,
        lng: postiion.coords.longitude,
      })
    },
    (err) => {
      console.error(err)
      toaster.pushError(t('geocoding.error'))
    },
    {
      enableHighAccuracy: true,
      timeout: 4000,
    }
  )
}

const suggestLocations = async () => {
  geocodingLoading.value = true
  const address = searchAddress.value
  useSuggestLocations({
    query: {
      address,
      locale: locale.value,
    },
  })
    .then((data) => {
      suggestedLocations.value = data
      nextTick(() => centerMap())
    })
    .catch((error) => {
      toaster.pushError(t('geocoding.error'))
      console.error(`Error fetching address: ${address}`, error)
    })
    .finally(() => {
      geocodingLoading.value = false
    })
}

// -- emit
const onDelete = (form) => {
  emit('delete', form)
  locationToDelete.value = null
  showForm.value = false
}
const onSubmit = () => {
  emit('submit', form.value)
  showForm.value = false
}
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: $space-l;

  & > div {
    width: 100%;
    max-width: 38rem;
  }
}

.location-map-ctn {
  height: 500px;
  border-radius: $border-radius-l;
  overflow: hidden;

  .leaflet-container {
    height: 100%;
  }

  .map-inner-ctn {
    height: 100%;

    .map {
      height: 100%;
    }
  }

  &.full-screen-map-ctn {
    height: 100%;
  }
}

:deep(.leaflet-div-icon) {
  border: none;
  background: transparent;
}

.buttons-line {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.input-field,
.notice {
  margin-bottom: $space-l;
}

.notice {
  text-align: center;
}

.suggested-locations-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
