<template>
  <div class="leaflet-map skeletons-background" :class="{ loading }">
    <client-only>
      <BaseMap ref="map" use-cluster>
        <MultiLocation :locations="locationsFilter" @edit="emit('edit', $event)" />
        <template #controls>
          <ContainerMapControl>
            <slot name="controls-top" />
            <MapControlZoom />
            <MapControlLocationType
              ref="locationType"
              :locations="locations ?? []"
              @update="onUpdate('locationType', $event)"
            />
            <slot name="controls-bottom" />
          </ContainerMapControl>
        </template>
      </BaseMap>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import BaseMap, { ExposeMap } from '@/components/map/BaseMap.vue'
import ContainerMapControl from '@/components/map/Control/ContainerMapControl.vue'
import MapControlLocationType from '@/components/map/Control/MapControlLocationType.vue'
import MapControlZoom from '@/components/map/Control/MapControlZoom.vue'
import MultiLocation from '@/components/map/MultiLocation.vue'
import { TranslatedLocationGeneral } from '@/interfaces/maps'
import { LocationType } from '@/models/types'

const props = withDefaults(
  defineProps<{
    locations: TranslatedLocationGeneral[]
    loading?: boolean
  }>(),
  { loading: false }
)

const emit = defineEmits<{
  edit: [TranslatedLocationGeneral]
}>()

const filters = ref<{
  locationType: Record<LocationType, boolean>
}>({
  locationType: {
    team: true,
    address: true,
    impact: true,
    news: true,
    event: true,
  },
})

// re-expose mapref
defineExpose<ExposeMap>(useTemplateRef('map'))

const onUpdate = (name, query) => {
  filters.value[name] = query
}

const locationsFilter = computed(() => {
  let locations = props.locations
  if (!locations) {
    return []
  }

  // filter by locationsTypes
  locations = locations.filter((location) => {
    return !!filters.value.locationType[location.type]
  })

  // TODO add more filters
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
