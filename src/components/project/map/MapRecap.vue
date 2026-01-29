<template>
  <div class="map-recap">
    <div class="map-inner-ctn">
      <div class="map">
        <ClientOnly>
          <BaseMap ref="summary-map" :config="CONFIG" use-cluster @map-moved="$emit('map-moved')">
            <template #default="slotProps">
              <template v-if="slotProps.map">
                <MapPointer
                  v-for="location in locations"
                  :key="location.id"
                  :location="location"
                  @mounted="slotProps.addPointer"
                  @unmounted="slotProps.removePointer(location)"
                >
                  <LocationTooltip
                    v-if="location.title || location.description"
                    :location="location"
                  />
                </MapPointer>
              </template>
            </template>
          </BaseMap>
        </ClientOnly>
      </div>
      <ContextActionButton
        :secondary="true"
        class="map-button"
        action-icon="Expand"
        @click="projectLayoutToggleAddModal('location')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import BaseMap from '@/components/map/BaseMap.vue'
import { TranslatedLocation } from '@/models/location.model'
import LocationTooltip from '@/components/map/LocationTooltip.vue'

const props = withDefaults(
  defineProps<{
    locations?: TranslatedLocation[]
    focusedLocation?: TranslatedLocation
  }>(),
  {
    locations: () => [],
    focusedLocation: null,
  }
)

const projectLayoutToggleAddModal: any = inject('projectLayoutToggleAddModal')
defineEmits(['map-moved'])

const summaryMapRef = useTemplateRef('summary-map')
const CONFIG = {
  zoom: 5,
  maxZoom: 17,
}

watch(
  () => props.locations,
  () => summaryMapRef.value?.centerMap(),
  { deep: true }
)

watch(
  () => props.focusedLocation,
  (neo, old) => {
    if (neo && (neo.lat !== old?.lat || neo.lng !== old?.lng)) {
      summaryMapRef.value?.flyTo(neo, 8)
    }
  }
)

defineExpose({
  map: summaryMapRef,
})
</script>

<style lang="scss" scoped>
.map-recap {
  height: 350px;
  overflow: hidden;
  border-radius: $border-radius-l;
  position: relative;

  .leaflet-container {
    height: 100%;
  }

  .map-inner-ctn {
    width: 100%;
    height: 100%;
    position: relative;

    .vue2leaflet-map,
    .leaflet-interactive {
      cursor: auto !important;
      pointer-events: none;
    }

    .map {
      overflow: hidden;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      z-index: 0;

      .leaflet-marker-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        .pin-icon {
          height: 20px;
          fill: $primary-dark;
        }
      }
    }

    .leaflet-control-zoom {
      display: none !important;
    }
  }

  .leaflet-map.loading {
    filter: blur(4px);
  }

  .map-button {
    position: absolute;
    top: 14px;
    right: 12px;
    background: $white;
    border: $border-width-s solid $primary-dark;
  }

  .actions {
    display: flex;
    position: absolute;
    max-width: min-content;
    top: 5rem;
    right: 0.8rem;
    justify-content: flex-end;
    gap: $space-xs;
    z-index: 10;
    transform: translate(0, -50%);
  }
}
</style>
