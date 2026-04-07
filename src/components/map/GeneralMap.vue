<template>
  <div class="leaflet-map skeletons-background" :class="{ loading }">
    <client-only>
      <BaseMap ref="map" @click="$emit('click', $event)">
        <MarkerLocations
          :editable="editable"
          :locations="locationsFilter"
          @edit="emit('edit', $event)"
        />
        <template #controls>
          <ContainerMapControl v-if="controls">
            <slot name="controls-top" />
            <MapControlExpand v-if="controlExpand" @expand="$emit('expand')" />
            <MapControlZoom v-if="controlZoom" />
            <MapControlLocationType
              v-if="controlFilter"
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

<script setup lang="ts" generic="T extends AnyTranslatedLocation">
import BaseMap, { ExposeMap } from '@/components/map/BaseMap.vue'
import ContainerMapControl from '@/components/map/Control/ContainerMapControl.vue'
import MapControlExpand from '@/components/map/Control/MapControlExpand.vue'
import MapControlLocationType from '@/components/map/Control/MapControlLocationType.vue'
import MapControlZoom from '@/components/map/Control/MapControlZoom.vue'
import MarkerLocations from '@/components/map/MarkerLocations.vue'
import { AnyTranslatedLocation } from '@/models/location.model'
import { LocationType } from '@/models/types'

const props = withDefaults(
  defineProps<{
    locations: T[]
    loading?: boolean
    controls?: boolean
    controlExpand?: boolean
    controlZoom?: boolean
    controlFilter?: boolean
    editable?: boolean
  }>(),
  {
    loading: false,
    controls: true,
    editable: false,
    controlExpand: true,
    controlZoom: true,
    controlFilter: true,
  }
)

const emit = defineEmits<{
  edit: [T]
  expand: []
  click: [Pick<T, 'lat' | 'lng'>]
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
  z-index: 0;
}

.leaflet-map.loading {
  filter: blur(4px);
}
</style>
