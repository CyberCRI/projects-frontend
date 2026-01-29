<template>
  <div v-if="!!projectId">
    <BaseDrawer
      no-footer
      :is-opened="isOpened"
      :title="$t('project.edit-map')"
      :confirm-action-name="$t('common.save')"
      @close="$emit('close')"
      @confirm="$emit('close')"
    >
      <div class="top">
        <div v-if="!addMode">
          <p v-if="isGeocodingEnabled" class="notice">{{ $t('geocoding.choose-method') }}</p>
          <div class="buttons-line">
            <LpiButton
              :label="
                $t(
                  isGeocodingEnabled
                    ? 'geocoding.click-method'
                    : 'geocoding.click-method-no-geocoding'
                )
              "
              @click="addMode = CLICK_MODE"
            />
            <LpiButton
              v-if="isGeocodingEnabled"
              :label="$t('geocoding.form-method')"
              @click="addMode = FORM_MODE"
            />
          </div>
        </div>
        <div v-else-if="addMode === CLICK_MODE">
          <p class="notice">{{ $t('geocoding.click-method-notice') }}</p>
          <div class="buttons-line">
            <LpiButton :label="$t('common.cancel')" @click="addMode = null" />
          </div>
        </div>
        <div v-else-if="addMode === FORM_MODE">
          <div v-if="!suggestedLocations || !suggestedLocations.length">
            <div class="input-field">
              <TextInput
                v-model="newLocationAddress"
                autofocus
                :placeholder="$t('geocoding.form-placeholder')"
                :label="$t('geocoding.form-method-notice')"
                @keyup.enter="!!newLocationAddress && suggestLocations()"
              />
            </div>
            <p v-if="suggestedLocations && !suggestedLocations.length" class="notice">
              {{ $t('geocoding.no-results') }}
            </p>
            <div class="buttons-line">
              <LpiButton
                :label="$t('common.cancel')"
                :disabled="geocodingAsyncing"
                :btn-icon="geocodingAsyncing ? 'LoaderSimple' : null"
                @click="addMode = null"
              />
              <LpiButton
                :disabled="!newLocationAddress || geocodingAsyncing"
                :label="$t('geocoding.search')"
                :btn-icon="geocodingAsyncing ? 'LoaderSimple' : null"
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

      <div class="full-screen-map-ctn project-map-ctn">
        <div class="map-inner-ctn">
          <div class="map">
            <client-only>
              <LazyBaseMap
                ref="map"
                :key="mapkey"
                @click="addMode === CLICK_MODE ? openAddModal($event) : null"
              >
                <template #default="slotProps">
                  <template v-if="slotProps.map && !suggestedLocations">
                    <MapPointer
                      v-for="location in locations"
                      :key="location.id"
                      is-editable
                      :location="location"
                      @edit-location="openEditModal"
                      @mounted="slotProps.addPointer($event, {})"
                      @unmounted="slotProps.removePointer(location)"
                    >
                      <LocationTooltip
                        v-if="location.title || location.description"
                        :location="location"
                      />
                    </MapPointer>
                  </template>
                  <template v-if="slotProps.map && filteredSuggestedLocations">
                    <MapSuggestion
                      v-for="location in filteredSuggestedLocations"
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
      v-if="formVisible"
      :project-id="projectId"
      :address="newLocationAddress"
      :location-to-be-edited="locationToBeEdited"
      :new-coordinates="newCoordinates"
      @close="closeLocationForm"
      @center-map="centerMap"
      @location-edited="$emit('reload-locations')"
      @location-created="onLocationCreated"
      @location-deleted="$emit('reload-locations')"
    />

    <ConfirmModal
      v-if="locationToDelete"
      :asyncing="deleteAsyncing"
      :title="$t('geocoding.delete-location')"
      :content="$t('geocoding.confirm-delete-location')"
      @cancel="locationToDelete = null"
      @confirm="onConfirmDeleteLocation"
    />
  </div>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import LocationForm from '@/components/project/map/LocationForm.vue'
import useToasterStore from '@/stores/useToaster'
import analytics from '@/analytics'
import { deleteLocation } from '@/api/locations.services'
import { TranslatedLocation } from '@/models/location.model'
import LocationTooltip from '@/components/map/LocationTooltip.vue'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    locations?: TranslatedLocation[]
    projectId?: string
  }>(),
  {
    isOpened: false,
    locations: () => [],
    projectId: null,
  }
)

const emit = defineEmits<{
  close: []
  'reload-locations': []
}>()

const { canEditProject } = usePermissions()
const toaster = useToasterStore()
const runtimeConfig = useRuntimeConfig()
const { locale, t } = useNuxtI18n()

const CLICK_MODE = 'click'
const FORM_MODE = 'form'

const mapkey = ref(0)
const formVisible = ref(false)
const locationToBeEdited = ref(null)
const newCoordinates = ref([])
const addMode = ref(null)
const newLocationAddress = ref('')
const locationToDelete = ref(null)
const deleteAsyncing = ref(false)
const geocodingAsyncing = ref(false)

// null be no search done, empty array mean no result
const suggestedLocations = ref(null)
const suggestedLocationsFilters = ref({})

const isGeocodingEnabled = computed(() => !!runtimeConfig.public.appGeocodingApiUrl)
const filteredSuggestedLocations = computed(() => {
  return (
    suggestedLocations.value?.filter(
      (location) => suggestedLocationsFilters.value[location.type]
    ) || null
  )
})

watch(addMode, () => {
  suggestedLocations.value = null
  newLocationAddress.value = ''
  suggestedLocationsFilters.value = {}
})

watchEffect(() => {
  if (props.isOpened) {
    mapkey.value++
  }
})

const mapRef = useTemplateRef('map')

const centerMap = () => mapRef.value?.centerMap()

const onLocationCreated = (location) => {
  suggestedLocations.value = null
  addMode.value = null
  emit('reload-locations')
  mapRef.value?.flyTo(location, 8)
}

const openEditModal = (location) => {
  if (canEditProject) {
    // restart from source locations because the map ones are not reactive
    locationToBeEdited.value = props.locations.find((loc) => loc.id === location.id)
    formVisible.value = true
  }
}

const closeLocationForm = () => {
  addMode.value = null
  formVisible.value = false
}

const openAddModal = (event) => {
  if (canEditProject) {
    locationToBeEdited.value = null
    newCoordinates.value = [event.latlng.lat, event.latlng.lng]
    formVisible.value = true
  }
}

const suggestLocations = async () => {
  const address = newLocationAddress.value
  geocodingAsyncing.value = true
  try {
    const res = await $fetch('/geocoding', {
      query: {
        address,
        locale: locale.value,
      },
    })
    suggestedLocations.value = res
    suggestedLocationsFilters.value = res.reduce((acc, location) => {
      acc[location.type] = true
      return acc
    }, {})

    nextTick(() => centerMap())
  } catch (error) {
    toaster.pushError(t('geocoding.error'))
    console.error(`Error fetching address: ${address}`, error)
  } finally {
    geocodingAsyncing.value = false
  }
}

const onConfirmDeleteLocation = async () => {
  try {
    deleteAsyncing.value = true
    await deleteLocation(props.projectId, locationToDelete.value.id)

    analytics.location.deleteLocationMapPoint({
      project: {
        id: props.projectId,
      },
      location: locationToDelete.value,
    })

    toaster.pushSuccess(t('toasts.location-delete.success'))

    emit('reload-locations')
    nextTick(() => centerMap())
  } catch (error) {
    toaster.pushError(`${t('toasts.location-delete.error')} (${error})`)
    console.error(error)
  } finally {
    deleteAsyncing.value = false
    locationToDelete.value = null
  }
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

.project-map-ctn {
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
    height: 74vh;
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
