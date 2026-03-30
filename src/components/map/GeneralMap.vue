<template>
  <div class="leaflet-map" :class="{ loading }">
    <client-only>
      <BaseMap ref="map" use-cluster>
        <template #default="slotProps">
          <MultiLocation :map="slotProps" :locations="locations" />
        </template>
        <template #controls>
          <ContainerMapControl>
            <MapControlZoom />
            <!-- <MapControlLocationType /> -->
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

withDefaults(
  defineProps<{
    locations: LocationGeneral[]
    loading?: boolean
  }>(),
  { loading: true }
)
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
