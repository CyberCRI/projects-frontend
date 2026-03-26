<template>
  <div class="leaflet-map" :class="{ loading }">
    <client-only>
      <BaseMap ref="map" :config="CONFIG" use-cluster>
        <template #default="slotProps">
          <MapPointer
            v-for="location in locations"
            :key="location.id"
            :location="location"
            @mounted="slotProps.addPointer"
            @unmounted="slotProps.removePointer"
          >
            <!-- <LocationTooltipDynamic :location="location" /> -->
          </MapPointer>
        </template>
      </BaseMap>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import BaseMap from '@/components/map/BaseMap.vue'
import LocationTooltipDynamic from '@/components/map/LocationTooltipDynamic.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import { LocationGeneral } from '@/interfaces/maps'

const props = withDefaults(
  defineProps<{
    locations: LocationGeneral[]
    loading?: boolean
  }>(),
  { loading: true }
)

const CONFIG = {
  zoom: 1,
  maxZoom: 17,
  minZoom: 0,
}

const mapRef = useTemplateRef('map')
watchEffect(() => {
  if (!props.loading && mapRef.value) {
    mapRef.value.centerMap()
  }
})
</script>

<style lang="scss" scoped>
.leaflet-map {
  transition: filter 1s ease;
  overflow: hidden;
}

.leaflet-map.loading {
  filter: blur(4px);
}
</style>
