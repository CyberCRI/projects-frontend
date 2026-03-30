<script setup lang="ts">
import * as L from 'leaflet'

import type { LocationType } from '@/models/types'
import LocationTypeComponent from '@/components/map/LocationType.vue'

const { query, toggleQuery } = useQuery({
  address: true,
  impact: true,
  team: true,
})

const locationLayerGrouped = ref<{ [key in LocationType]?: L.Marker[] }>({})

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
  <div class="actions">
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
</style>
