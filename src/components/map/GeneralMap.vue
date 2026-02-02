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
            <ProjectLocationTooltip :location="location" />
          </MapPointer>
        </template>
      </BaseMap>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import BaseMap from '@/components/map/BaseMap.vue'
import MapPointer from '@/components/map/MapPointer.vue'
import ProjectLocationTooltip from '@/components/project/map/ProjectLocationTooltip.vue'
import { TranslatedLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    locations: TranslatedLocation[]
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
