<script setup lang="ts" generic="TLocation extends AnyTranslatedLocation">
import * as L from 'leaflet'

import type { AnyTranslatedLocation } from '@/models/location.model'
import type { LocationType } from '@/models/types'
import { groupBy } from 'es-toolkit'
import { renderToString } from '@vue/test-utils'
import MarkerIcon from '@/components/map/MarkerIcon.vue'
import LocationTypeComponent from '@/components/map/LocationType.vue'

const props = defineProps<{
  locations: TLocation[]
}>()

const { query, toggleQuery } = useQuery({
  address: true,
  impact: true,
  team: true,
})

const locationLayerGrouped = ref<{ [key in LocationType]?: L.Marker[] }>({})

const mapCluster = inject<Ref<L.MarkerClusterGroup>>('cluster')
const addLayers = inject<Ref<L.MarkerClusterGroup['addLayers']>>('addLayers')

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

watchEffect(async () => {
  const locations = props.locations
  if (!locations) {
    return
  }

  const layers = Layers

  addLayers.value()

  // group by locationType (team/impact/address ...ect) (grouped for filters)
  const locationGrouped = groupBy(props.locations, (item) => item.type)
  const loc: typeof locationLayerGrouped.value = {}

  for (const [locationType, locations] of Object.entries(locationGrouped)) {
    loc[locationType] = await locationToMarker(locations)
  }
  locationLayerGrouped.value = loc
})

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
  <Teleport to="body">
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
  </Teleport>
</template>

<style lang="scss" scoped>
.btn-filter {
  background-color: white;
  border-radius: 100%;
  padding: 0.5rem;
  transition: all 0.2s;

  cursor: pointer;

  svg {
    width: 1.5rem;
    color: black;
    fill: black;
  }

  &:hover {
    transform: scale(1.05);
  }
}

// h2 {
//   text-align: center;
//   padding-bottom: 1rem;
// }

// .list-actions {
//   display: flex;
//   gap: 0.5rem;
//   flex-direction: column;
// }

// .disabled {
//   opacity: 0.5;
// }
</style>
