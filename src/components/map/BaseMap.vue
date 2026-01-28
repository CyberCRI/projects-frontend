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
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

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

const mapInstance = ref(null)
const mapRef = useTemplateRef('map')
const markerCluster = ref(null)
const markers = ref(new Map())

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
  let teamHTML, impactHtml, addressHtml

  if (teamCluster.length) {
    teamHTML = document.createElement('div')
    teamHTML.className = 'team marker-ctn'
    teamHTML.appendChild(document.createTextNode('' + teamCluster.length))
    clusterMarker.appendChild(teamHTML)
  }
  if (impactCluster.length) {
    impactHtml = document.createElement('div')
    impactHtml.className = 'impact marker-ctn'
    impactHtml.appendChild(document.createTextNode('' + impactCluster.length))
    clusterMarker.appendChild(impactHtml)
  }

  if (addressCluster.length) {
    addressHtml = document.createElement('div')
    addressHtml.className = 'address marker-ctn'
    addressHtml.appendChild(document.createTextNode('' + addressCluster.length))
    clusterMarker.appendChild(addressHtml)
  }

  let clusterMarkerString = clusterMarker.outerHTML
  clusterMarkerString += '<span class="line" />'

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

const addPointer = async ({ markerContent, location, tooltip }, eventHandlers: any = null) => {
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
    tooltip.$el.addEventListener('contextmenu', (e) => {
      e.stopPropagation()
      e.preventDefault()
      emit('contextmenu', {
        isEdit: true,
        location,
        latlng: [location.lat, location.lng],
      })
    })
    marker.bindPopup(tooltip.$el)
  }
  if (eventHandlers) {
    for (const [enventName, eventHandler] of Object.entries(eventHandlers)) {
      marker.on(enventName, eventHandler as any)
    }
  }

  markers.value.set(location.id, marker)

  if (markerCluster.value) {
    markerCluster.value.addLayers(marker)
  } else {
    marker.addTo(mapInstance.value)
  }

  if (markerCluster.value) markerCluster.value.refreshClusters()
}

const removePointer = (location) => {
  const marker = markers.value.get(location.id)

  if (marker) {
    if (markerCluster.value) {
      marker.value.removeFrom(markerCluster.value)
    } else {
      mapInstance.value.removeLayer(marker)
    }
  }
  markers.value.delete(location.id)
  if (markerCluster.value) {
    markerCluster.value.refreshClusters()
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
    // @ts-expect-error ignore markercluster
    const markerCluster = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      chunkedLoading: true,
      iconCreateFunction: createClusterIcons,
    })

    map.addLayer(markerCluster)
    markerCluster.value = markerCluster
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
<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>
