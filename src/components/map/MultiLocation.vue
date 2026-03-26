<script setup lang="ts">
import * as L from 'leaflet'

import type { MapPointerOption } from '@/interfaces/maps'
import type { AnyTranslatedLocation } from '@/models/location.model'
import type { LocationType } from '@/models/types'
import { groupBy, pick } from 'es-toolkit'
import { renderToString } from '@vue/test-utils'
import MarkerIcon from '@/components/map/MarkerIcon.vue'
import LocationTypeComponent from '@/components/map/LocationType.vue'

const props = defineProps<{
  map: {
    addPointer: (conf: MapPointerOption, eventHandler: any) => void
    map: L.Map
    cluster: L.MarkerClusterGroup
  }
  locations: AnyTranslatedLocation[]
}>()

const { query, toggleQuery } = useQuery({
  address: true,
  impact: true,
  team: true,
})

const locationLayerGrouped = ref<{ [key in LocationType]?: L.Marker[] }>({})

const locationToMarker = async (locations: AnyTranslatedLocation[]) => {
  const markers: L.Marker[] = []
  const svg = await renderToString(MarkerIcon, { props: { location: locations[0] } })

  for (const location of locations) {
    const options = {
      icon: L.divIcon({
        className: `${location.type}`,
        html: svg,
        // @ts-expect-error ignore set
        location,
      }),
    }
    const marker = L.marker([location.lng, location.lat], options).bindPopup(`${location.title}`)
    markers.push(marker)
  }
  return markers
}

const onChange = () => {
  const cluster = toRaw(props.map.cluster)
  const map = toRaw(props.map.map)
  const layers = toRaw(locationLayerGrouped.value) as { [key in LocationType]: L.Marker[] }

  const bounds = map.getBounds()
  const toRemove = []
  const toAdd = []

  Object.entries(layers).forEach(([LocationType, markers]) => {
    // else remove all layers
    markers.forEach((marker) => {
      if (!query[LocationType] || !bounds.contains(marker.getLatLng())) {
        toRemove.push(marker)
      } else {
        // if enabled in query
        toAdd.push(marker)
      }
    })
  })
  cluster.removeLayers(toRemove)
  cluster.addLayers(toAdd)
  console.log(`total: ${toRemove.length}`)
}

onMounted(() => {
  const map = toRaw(props.map.map)
  map.on('move', onChange)
})

watch([locationLayerGrouped, query], onChange, { immediate: true })

watch(
  () => props.locations,
  async () => {
    const locations = props.locations
    if (!locations) {
      return
    }

    const locationGrouped = groupBy(props.locations, (item) => item.type)
    const loc: typeof locationLayerGrouped.value = {}

    for (const [locationType, locations] of Object.entries(locationGrouped)) {
      loc[locationType] = await locationToMarker(locations)
    }
    locationLayerGrouped.value = loc
  }
)

const enabledFilters = computed(() => {
  const layers = toRaw(locationLayerGrouped.value)
  return Object.keys(layers) as LocationType[]
})

const pointsCount = computed(() => {
  const layers = toRaw(locationLayerGrouped.value)

  return Object.entries(layers)
    .filter(([locationType]) => query[locationType])
    .reduce((acc, [, markers]) => acc + markers.length, 0)
})
</script>

<template>
  <div v-if="enabledFilters.length" class="actions">
    <h2>Menu</h2>
    <form class="list-actions">
      <LocationTypeComponent
        v-for="key in enabledFilters"
        :key="key"
        class="scale-hover"
        :class="{ disabled: !query[key] }"
        :location-type="key"
        @click="toggleQuery(key, true)"
      />

      <EmptyLabel v-if="pointsCount" :label="pointsCount.toString()" />
    </form>
  </div>
</template>

<style lang="scss" scoped>
.actions {
  position: absolute;
  background-color: white;
  margin: 1rem;
  border-radius: 1rem;
  top: 0;
  right: 0;
  padding: 1rem;
  z-index: 999999;

  h2 {
    text-align: center;
    padding-bottom: 1rem;
  }

  .list-actions {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
  }

  .disabled {
    opacity: 0.5;
  }
}
</style>
