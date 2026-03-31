<template>
  <div class="leaflet-map" :class="{ loading }">
    <client-only>
      <BaseMap ref="map" use-cluster>
        <template #default="mapProps">
          <MultiLocation :locations="locationsFilter" />
        </template>
        <template #controls>
          <ContainerMapControl>
            <MapControlZoom />
            <MapControlLocationType
              ref="locationType"
              :locations="locations ?? []"
              @update="onUpdate('locationType', $event)"
            />
            <slot name="actions" />
          </ContainerMapControl>
        </template>
      </BaseMap>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import BaseMap from '@/components/map/BaseMap.vue'
import ContainerMapControl from '@/components/map/Control/ContainerMapControl.vue'
import MapControlLocationType from '@/components/map/Control/MapControlLocationType.vue'
import MapControlZoom from '@/components/map/Control/MapControlZoom.vue'
import MultiLocation from '@/components/map/MultiLocation.vue'
import { LocationGeneral } from '@/interfaces/maps'
import { LocationType } from '@/models/types'

const props = withDefaults(
  defineProps<{
    locations: LocationGeneral[]
    loading?: boolean
  }>(),
  { loading: true }
)

const filters = ref<{
  locationType: { [key: LocationType]: boolean }
}>({
  locationType: {
    team: true,
    address: true,
    impact: true,
  },
})

const onUpdate = (name, query) => {
  filters.value[name] = query
}

const locationsFilter = computed(() => {
  let locations = props.locations
  if (!locations) {
    return []
  }

  locations = locations.filter((location) => {
    return !!filters.value.locationType[location.type]
  })

  // locations = locations.filter((location) => {
  //   return location.content_type == 'people_group'
  // })

  return locations
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
