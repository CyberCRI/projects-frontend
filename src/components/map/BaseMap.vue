<template>
  <div ref="map" class="map">
    <div class="hidden">
      <slot
        v-if="mapInstance"
        :add-pointer="addPointer"
        :remove-pointer="removePointer"
        :map="mapInstance"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet'
import fixLeaflet from '@/app/fixLeaflet'
import 'leaflet.markercluster'
import { LocationModel } from '@/models/location.model'
import { MapPointerOption } from '@/interfaces/maps'

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
  contextmenu: [any]
  click: [any]
  'map-moved': []
}>()

const mapInstance = ref<L.Map>(null)
const markerClusterInstance = ref<L.MarkerClusterGroup>(null)
const mapRef = useTemplateRef('map')
const markers = ref(new Map<number, L.Marker>())

const MAP_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const CONFIG: L.MapOptions = {
  center: [0, 0],
  zoom: 2,
  maxZoom: 18,
  minZoom: 2,
  maxBounds: [
    [-90, -175],
    [84, 195],
  ],
  maxBoundsViscosity: 1,
  worldCopyJump: true,
  ...props.config,
}
const ICON_SIZE: L.PointTuple = [80, 69]
const ICON_ANCHOR: L.PointTuple = ICON_SIZE ? [ICON_SIZE[0] / 2, ICON_SIZE[1]] : null

const createClusterIcons = (cluster) => {
  const markers = cluster.getAllChildMarkers()

  const teamCluster = []
  const impactCluster = []
  const addressCluster = []

  markers.forEach((m) => {
    const className = m.getIcon().options.className
    if (className === 'team') teamCluster.push(className)
    else if (className === 'impact') impactCluster.push(className)
    else if (className === 'address') addressCluster.push(className)
  })

  const clusterMarker = document.createElement('div')
  clusterMarker.className = 'cluster-ctn'

  if (teamCluster.length) {
    const teamHTML = document.createElement('div')
    teamHTML.className = 'team marker-ctn'
    teamHTML.appendChild(document.createTextNode('' + teamCluster.length))
    clusterMarker.appendChild(teamHTML)
  }
  if (impactCluster.length) {
    const impactHtml = document.createElement('div')
    impactHtml.className = 'impact marker-ctn'
    impactHtml.appendChild(document.createTextNode('' + impactCluster.length))
    clusterMarker.appendChild(impactHtml)
  }

  if (addressCluster.length) {
    const addressHtml = document.createElement('div')
    addressHtml.className = 'address marker-ctn'
    addressHtml.appendChild(document.createTextNode('' + addressCluster.length))
    clusterMarker.appendChild(addressHtml)
  }

  const clusterMarkerString = `${clusterMarker.outerHTML}<span class="line" />`

  const sizeClass = (cluster.getChildCount() + '').length
  return L.divIcon({
    html: clusterMarkerString,
    className: 'marker-cluster team size-' + sizeClass,
    iconSize: null,
  })
}

const centerMap = () => {
  nextTick(() => {
    if (!mapInstance.value) {
      return // fix error if quiting the map before it's loaded
    }

    const bounds = []
    markers.value.forEach((m) => {
      bounds.push([m.getLatLng().lat, m.getLatLng().lng])
    })
    // Make sure to "unproxy" the map before using it with Leaflet
    if (bounds.length) {
      mapInstance.value.fitBounds(bounds, { maxZoom: 5 })
    }
  })
}

const addPointer = async (
  { markerContent, location, tooltip }: MapPointerOption,
  eventHandlers: any = null
) => {
  const icon = L.divIcon({
    html: markerContent,
    className: location.type,
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
  })

  const marker = L.marker([location.lat, location.lng], { icon })
  if (tooltip) {
    // fix right click not triggering edit location
    // in project map edition
    tooltip.addEventListener('contextmenu', (e) => {
      console.log('icic')
      e.stopPropagation()
      e.preventDefault()
      emit('contextmenu', {
        isEdit: true,
        location,
        latlng: [location.lat, location.lng],
      })
    })
    marker.bindPopup(tooltip)
  }
  if (eventHandlers) {
    for (const [enventName, eventHandler] of Object.entries(eventHandlers)) {
      marker.on(enventName, eventHandler as any)
    }
  }

  markers.value.set(location.id, marker)

  if (markerClusterInstance.value) {
    markerClusterInstance.value.addLayers([marker])
    markerClusterInstance.value.refreshClusters()
  } else {
    marker.addTo(mapInstance.value as L.Map)
  }
}

const removePointer = (location: LocationModel) => {
  const marker = markers.value.get(location.id) as L.Marker

  if (!mapInstance.value || !marker) {
    return
  }

  if (markerClusterInstance.value) {
    // @ts-expect-error TODO why ts leaflet not work
    marker.removeFrom(markerClusterInstance.value)
  } else {
    mapInstance.value.removeLayer(marker)
  }

  markers.value.delete(location.id)
  if (markerClusterInstance.value) {
    markerClusterInstance.value.refreshClusters()
  }
  // force readraw
  mapInstance.value.invalidateSize()
}

// this is called by other components
const flyTo = (coordinates, zoom) =>
  mapInstance.value?.flyTo([coordinates.lat, coordinates.lng], zoom)

defineExpose({
  flyTo,
  centerMap,
  map: mapInstance,
})

onBeforeMount(() => fixLeaflet())
onMounted(() => {
  const map = L.map(mapRef.value, CONFIG)

  if (props.useCluster) {
    const markerCluster = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      chunkedLoading: true,
      iconCreateFunction: createClusterIcons,
    })

    map.addLayer(markerCluster)
    markerClusterInstance.value = markerCluster
  }

  map.on('contextmenu', (e) => emit('contextmenu', e))
  map.on('click', (e) => emit('click', e))
  L.tileLayer(MAP_URL, {
    attribution:
      '<a href="https://carto.com/basemaps/">Basemaps</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map)

  map.on('move', () => emit('map-moved'))

  nextTick(() => centerMap())
  mapInstance.value = map
})
</script>

<style lang="scss">
// do NOT scope this style, it will break the map
@import '@/design/scss/map';
</style>

<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>
