<template>
  <div class="contents">
    <div ref="map" v-click-outside="closePopUp" class="map">
      <div class="hidden">
        <slot v-if="mapInstance" />
      </div>
    </div>
    <slot name="controls" />
  </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet'
import fixLeaflet from '@/app/fixLeaflet'
import 'leaflet.markercluster'
import { AnyLocation, TranslatedLocation } from '@/models/location.model'
import { Geocoding } from '@/interfaces/maps'
import { IconMapLocationType } from '@/functs/maps'
import { ICONS } from '@/functs/IconImage'
import { LocationType } from '@/models/types'

const props = withDefaults(
  defineProps<{
    config?: Partial<L.MapOptions>
    useCluster?: boolean
  }>(),
  {
    config: () => ({}),
    useCluster: false,
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

const mapInstance = shallowRef<L.Map>(null)
const markerClusterInstance = ref<L.MarkerClusterGroup>(null)
const mapRef = useTemplateRef('map')
const markers = ref(new Map<TranslatedLocation['id'] | Geocoding['id'], L.Marker>())
const { t } = useNuxtI18n()

const MAP_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const CONFIG: L.MapOptions = {
  center: [0, 0],
  zoom: 2,
  maxZoom: 20,
  minZoom: 2,
  maxBounds: [
    [-90, -175],
    [84, 195],
  ],
  maxBoundsViscosity: 1,
  preferCanvas: true,
  zoomControl: false,
  ...props.config,
}

const createClusterIcons = (cluster) => {
  const markers = cluster.getAllChildMarkers()

  const counterLocationType: { [key in LocationType]?: number } = {}

  markers.forEach((m) => {
    const locationType = m.options.location.type
    counterLocationType[locationType] ??= 0
    counterLocationType[locationType] += 1
  })

  const clusterMarker = document.createElement('div')
  clusterMarker.className = 'cluster-container shadowed-box'

  Object.entries(counterLocationType).forEach(([LocationType, count]) => {
    const container = document.createElement('div')
    container.className = `cluster-element ${LocationType}`
    container.title = t(`location.${LocationType}`)
    const icon = ICONS[IconMapLocationType(LocationType as LocationType)]
    container.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="location-icon">${icon}</svg>
      <span>${count}</span>
    `
    clusterMarker.appendChild(container)
  })

  const clusterMarkerString = `${clusterMarker.outerHTML}<div class="line" />`

  return L.divIcon({
    html: clusterMarkerString,
    className: 'cluster-parent',
    iconSize: null,
  })
}

const bounds = computed<L.LatLngBoundsLiteral>(() => {
  return Array.from(markers.value).map(([, m]) => [m.getLatLng().lat, m.getLatLng().lng])
})

const centerMap = () => {
  nextTick(() => {
    // Make sure to "unproxy" the map before using it with Leaflet
    const map = toRaw(mapInstance.value)
    if (!map) {
      return // fix error if quiting the map before it's loaded
    }

    if (bounds.value.length) {
      map.fitBounds(bounds.value, { maxZoom: 5 })
    }
  })
}

const closePopUp = () => {
  const map = toRaw(mapInstance.value)
  map?.closePopup()
}

const addLayers = (layers: L.Layer[]) => {
  const cluster = toRaw(markerClusterInstance.value)

  // get all layers actualy loaded
  const toRemove = cluster.getLayers()
  let toAdd = layers

  // all layers not included in toAdd, need to be removed
  cluster.removeLayers(Array.from(toRemove).filter((el) => !toAdd.includes(el)))
  cluster.addLayers(toAdd)
}

const EXPOSE = Object.freeze({
  cluster: markerClusterInstance,
  map: mapInstance,
  centerMap,
  closePopUp,
  addLayers,
})

defineExpose(EXPOSE)
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

  if (props.useCluster) {
    const markerCluster = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      chunkedLoading: true,
      iconCreateFunction: createClusterIcons,
    })

    map.addLayer(markerCluster)
    markerClusterInstance.value = markerCluster
  }

  // click on maps to select points
  map.on('click', (e) => emit('click', e))

  mapInstance.value = map
  centerMap()
})
</script>

<style lang="scss">
// do NOT scope this style, it will break the map
@import '@/design/scss/map';
</style>

<style lang="scss" scoped>
.map {
  height: 100%;
  background-color: #cee2ea;
}
</style>
