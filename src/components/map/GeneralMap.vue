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

<script>
import BaseMap from '@/components/map/BaseMap.vue'
import MapPointer from '@/components/map/MapPointer.vue'

export default {
  name: 'GeneralMap',

  components: {
    MapPointer,
    BaseMap,
  },

  props: {
    locations: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      config: {
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
      },
    }
  },

  watch: {
    loading(neo) {
      if (!neo && this.$refs && this.$refs.map) {
        console.log('cenbter')
        this.$refs.map.centerMap()
      }
    },
  },
}
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
