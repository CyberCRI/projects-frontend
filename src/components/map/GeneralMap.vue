<template>
  <div class="leaflet-map" :class="{ loading }">
    <BaseMap ref="map" :config="config" :use-cluster="true">
      <template #default="slotProps">
        <MapPointer
          v-for="location in locations"
          :key="location.id"
          :location="location"
          :has-project-tip="true"
          @mounted="slotProps.addPointer"
          @unmounted="slotProps.removePointer(location)"
        />
      </template>
    </BaseMap>
  </div>
</template>

<script setup lang="ts">
import BaseMap from '@/components/map/BaseMap.vue'
import MapPointer from '@/components/map/MapPointer.vue'

defineOptions({ name: 'GeneralMap' })

const props = withDefaults(
  defineProps<{
    locations: any[]
    loading?: boolean
  }>(),
  { loading: true }
)

const config = {
  mapUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  zoom: 1,
  maxZoom: 17,
  minZoom: 0,
  maxBounds: [
    [-90, -175],
    [84, 195],
  ],
  maxBoundsViscosity: 1.0,
  iconSize: [80, 69],
  useCluster: true,
  worldCopyJump: true,
}

const mapRef = useTemplateRef('map')

watch(
  () => props.loading,
  (neo) => {
    if (!neo && mapRef.value) {
      console.log('center')
      mapRef.value.centerMap()
    }
  }
)
</script>

<style lang="scss">
// do NOT scope this style, it will break the map
@import '@/design/scss/map';
</style>

<style lang="scss" scoped>
.leaflet-map {
  transition: filter 1s ease;
  overflow: hidden;
}

.leaflet-map.loading {
  filter: blur(4px);
}
</style>
