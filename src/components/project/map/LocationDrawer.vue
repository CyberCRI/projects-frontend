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
      <!--div class="top">
        <LpiSnackbar icon="QuestionMark" type="info">
          <ol>
            <li>{{ $t('project.map-hint-1') }}</li>
            <li>{{ $t('project.map-hint-2') }}</li>
            <li>{{ $t('project.map-hint-3') }}</li>
          </ol>
        </LpiSnackbar>
      </div-->

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
          <p class="notice">{{ $t('geocoding.form-method-notice') }}</p>
          <div class="input-field">
            <TextInput v-model="newLocationAddress" :label="$t('geocoding.address')" />
          </div>
          <div class="buttons-line">
            <LpiButton
              :label="$t('common.cancel')"
              :disabled="geocodingAsyncing"
              :btn-icon="asyncing ? 'LoaderSimple' : null"
              @click="addMode = null"
            />
            <LpiButton
              :disabled="!newLocationAddress || geocodingAsyncing"
              :label="$t('common.save')"
              :btn-icon="asyncing ? 'LoaderSimple' : null"
              @click="addFromForm"
            />
          </div>
        </div>
      </div>

      <div class="full-screen-map-ctn project-map-ctn">
        <div class="map-inner-ctn">
          <div class="map">
            <LazyBaseMap
              ref="map"
              :key="mapkey"
              :config="config"
              @click="addMode === CLICK_MODE ? openAddModal($event) : null"
            >
              <template #default="slotProps">
                <template v-if="slotProps.map">
                  <MapPointer
                    v-for="location in locations"
                    :key="location.id"
                    is-deletable
                    is-editable
                    :location="location"
                    :has-location-tip="location.title.length > 0 || location.description.length > 0"
                    @delete-location="locationToDelete = $event"
                    @edit-location="openEditModal"
                    @mounted="slotProps.addPointer($event, {})"
                    @unmounted="slotProps.removePointer(location)"
                  />
                </template>
              </template>
            </LazyBaseMap>
          </div>
        </div>
      </div>
    </BaseDrawer>

    <LocationForm
      v-if="formVisible"
      :project-id="projectId"
      :location-to-be-edited="locationToBeEdited"
      :new-coordinates="newCoordinates"
      @close="formVisible = false"
      @center-map="centerMap"
      @location-edited="$emit('reload-locations')"
      @location-created="$emit('reload-locations')"
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

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import LocationForm from '@/components/project/map/LocationForm.vue'
//import LocationTooltip from '@/components/map/LocationTooltip.vue'
import { LazyBaseMap } from '#components'
import useToasterStore from '@/stores/useToaster'
import analytics from '@/analytics'
import { deleteLocation } from '@/api/locations.services'

export default {
  name: 'LocationDrawer',

  components: {
    BaseDrawer,
    LocationForm,
    MapPointer,
    //LocationTooltip,
    LazyBaseMap,
  },

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },

    projectId: {
      type: [String || number || null],
      default: null,
    },

    locations: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['close', 'reload-locations'],

  setup() {
    const { canEditProject } = usePermissions()
    const toaster = useToasterStore()
    const runtimeConfig = useRuntimeConfig()
    return { canEditProject, toaster, runtimeConfig }
  },

  data() {
    return {
      mapkey: 0,
      config: {
        mapUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        zoom: 2,
        maxZoom: 18,
        minZoom: 2,
        maxBounds: [
          [-90, -175],
          [84, 195],
        ],
        maxBoundsViscosity: 1.0,
        iconSize: [80, 69],
        worldCopyJump: true,
      },
      formVisible: false,
      locationToBeEdited: null,
      newCoordinates: [],
      mapVisible: true,
      addMode: null,
      CLICK_MODE: 'click',
      FORM_MODE: 'form',
      newLocationAddress: '',
      locationToDelete: null,
      deleteAsyncing: false,
      geocodingAsyncing: false,
    }
  },

  computed: {
    isGeocodingEnabled() {
      return !!this.runtimeConfig.public.appGeocodingApiUrl
    },
  },
  watch: {
    locations() {
      this.mapkey++
    },

    isOpened(neo) {
      if (neo) this.mapkey++
    },
  },

  methods: {
    centerMap() {
      if (this.$refs.map) this.$refs.map.centerMap()
    },

    openEditModal(location) {
      if (this.canEditProject) {
        // restart from source locations because the map ones are not reactive
        this.locationToBeEdited = this.locations.find((loc) => loc.id === location.id)
        this.formVisible = true
      }
    },

    openAddModal(event) {
      if (this.canEditProject) {
        this.addMode = null
        this.locationToBeEdited = null
        this.newCoordinates = [event.latlng.lat, event.latlng.lng]
        this.formVisible = true
      }
    },

    async addFromForm() {
      const address = this.newLocationAddress
      this.geocodingAsyncing = true
      try {
        // TODO: use an env variable for the geocoding API URL
        const res = await $fetch(runtimeConfig.public.appGeocodingApiUrl, {
          query: {
            q: address,
          },
        })

        const firstPointFeature = (res?.features || []).filter(
          (feature) => feature.geometry.type === 'Point'
        )[0]

        if (!firstPointFeature?.geometry?.coordinates) {
          this.toaster.pushError(this.$t('geocoding.no-results'))
          console.log(`No result for address: ${address}`)
          return
        }
        const lng = firstPointFeature.geometry.coordinates[0]
        const lat = firstPointFeature.geometry.coordinates[1]
        this.newLocationAddress = ''
        this.openAddModal({
          latlng: {
            lat,
            lng,
          },
        })
      } catch (error) {
        this.toaster.pushError(this.$t('geocoding.error'))
        console.error(`Error fetching address: ${address}`, error)
      } finally {
        this.geocodingAsyncing = false
      }
    },

    async onConfirmDeleteLocation() {
      try {
        this.deleteAsyncing = true
        await deleteLocation(this.locationToDelete)

        analytics.location.deleteLocationMapPoint({
          project: {
            id: this.projectId,
          },
          location: this.locationToDelete,
        })

        this.toaster.pushSuccess(this.$t('toasts.location-delete.success'))

        this.$emit('reload-locations')
        this.$nextTick(() => this.centerMap())
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.location-delete.error')} (${error})`)
        console.error(error)
      } finally {
        this.deleteAsyncing = false
        this.locationToDelete = null
      }
    },
  },
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
</style>
