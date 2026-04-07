<template>
  <div class="map-container">
    <div ref="map" v-click-outside="closePopUp" class="map">
      <div class="hidden">
        <slot v-if="mapInstance" />
      </div>
    </div>
    <slot v-if="mapInstance" name="controls" />
  </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet'
import fixLeaflet from '@/app/fixLeaflet'
import 'leaflet.markercluster'
import { AnyLocation } from '@/models/location.model'
import { createClusterIcons } from '@/functs/maps'
import { UnwrapRef } from 'vue'

const props = withDefaults(
  defineProps<{
    config?: Partial<L.MapOptions>
  }>(),
  {
    config: () => ({}),
  }
)

const emit = defineEmits<{
  contextmenu: [
    {
      isEdit: boolean
      location: AnyLocation
      latlng: [number, number]
    },
  ]
  click: [any]
}>()

const mapInstance = ref<L.Map>(null)
const markerClusterInstance = ref<L.MarkerClusterGroup>(null)
const mapRef = useTemplateRef('map')

const MAP_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const CONFIG: L.MapOptions = {
  center: [0, 0],
  zoom: 2,
  maxZoom: 20,
  minZoom: 1,
  maxBoundsViscosity: 1,
  preferCanvas: true,
  zoomControl: false,
  ...props.config,
}

const centerMap = (options?: L.FitBoundsOptions) => {
  nextTick(() => {
    // Make sure to "unproxy" the map before using it with Leaflet
    const map = toRaw(mapInstance.value)
    const cluster = toRaw(markerClusterInstance.value)
    if (!map || !cluster) {
      return
    }

    // default bounds if not layers exists
    const bounds = cluster.getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { maxZoom: 10, ...options, padding: [10, 10] })
    }
  })
}

const closePopUp = () => {
  const map = toRaw(mapInstance.value)
  map?.closePopup()
}

const refreshMap = () => {
  const cluster = toRaw(markerClusterInstance.value)
  const map = toRaw(mapInstance.value)

  cluster.refreshClusters()
  map.invalidateSize()
  centerMap()
}

const removeLayers = (layers: L.Layer[]) => {
  const cluster = toRaw(markerClusterInstance.value)
  cluster.removeLayers(layers)
  refreshMap()
}

const getLayers = () => {
  const cluster = toRaw(markerClusterInstance.value)
  return cluster.getLayers()
}

const addLayers = (layers: L.Layer[]) => {
  const cluster = toRaw(markerClusterInstance.value)

  // get all layers actualy loaded
  const toRemove = getLayers()
  let toAdd = layers

  // all layers not included in toAdd, need to be removed
  removeLayers(Array.from(toRemove).filter((el) => !toAdd.includes(el)))
  cluster.addLayers(toAdd)
  refreshMap()
}

const EXPOSE = {
  cluster: markerClusterInstance,
  map: mapInstance,
  centerMap,
  closePopUp,
  addLayers,
  removeLayers,
  getLayers,
  refreshMap,
}
export type ExposeMap = UnwrapRef<typeof EXPOSE>

defineExpose<typeof EXPOSE>(EXPOSE)
// provide for subchild all exposed method
Object.entries(EXPOSE).forEach(([key, value]) => {
  provide(key, value)
})

onBeforeMount(() => fixLeaflet())
onMounted(() => {
  const map = L.map(mapRef.value, CONFIG)
  L.tileLayer(MAP_URL, {
    attribution:
      '<a href="https://carto.com/basemaps/">Basemaps</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map)

  const markerCluster = L.markerClusterGroup({
    removeOutsideVisibleBounds: true,
    chunkedLoading: true,
    iconCreateFunction: createClusterIcons,
  })

  map.addLayer(markerCluster)
  markerClusterInstance.value = markerCluster

  // click on maps to select points
  map.on('click', (e) => emit('click', e))

  mapInstance.value = map
  centerMap()
})
</script>

<style lang="scss">
// do NOT scope this style, it will break the map
@import '@/design/scss/map';

.leaflet-container {
  min-height: 100%;
}
</style>

<style lang="scss" scoped>
.map {
  height: 100%;
  background-color: #cee2ea;
  border-radius: $border-radius-l;
  position: relative;
}

.map-container {
  position: relative;
  height: 100%;
}
</style>
