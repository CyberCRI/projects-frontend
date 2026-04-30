<template>
  <div class="leaflet-map" :class="{ loading }">
    <client-only>
      <BaseMap ref="map" :config="CONFIG" use-cluster>
        <template #default="slotProps">
          <MapPointer
            v-for="location in locations.groups"
            :key="location.id"
            :location="location"
            @mounted="slotProps.addPointer"
            @unmounted="slotProps.removePointer"
          >
            <GroupLocationToolTip :location="location" :group="location.people_group" />
          </MapPointer>
          <MapPointer
            v-for="location in locations.projects"
            :key="location.id"
            :location="location"
            @mounted="slotProps.addPointer"
            @unmounted="slotProps.removePointer"
          >
            <ProjectLocationTooltip :location="location" :project="location.project" />
          </MapPointer>

          <MapPointer
            v-for="location in locations.news"
            :key="location.id"
            :location="location"
            @mounted="slotProps.addPointer"
            @unmounted="slotProps.removePointer"
          >
            <LocationNewsTooltip :location="location" :news="location.news" />
          </MapPointer>

          <MapPointer
            v-for="location in locations.event"
            :key="location.id"
            :location="location"
            @mounted="slotProps.addPointer"
            @unmounted="slotProps.removePointer"
          >
            <LocationEventTooltip :location="location" :event="location.event" />
          </MapPointer>
        </template>
      </BaseMap>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedLocations } from '~/interfaces/maps'

import ProjectLocationTooltip from '~/components/project/map/ProjectLocationTooltip.vue'
import GroupLocationToolTip from '~/components/group/Map/GroupLocationToolTip.vue'
import LocationEventTooltip from '~/components/event/map/LocationEventTooltip.vue'
import LocationNewsTooltip from '~/components/news/map/LocationNewsTooltip.vue'
import MapPointer from '~/components/map/MapPointer.vue'
import BaseMap from '~/components/map/BaseMap.vue'

const props = withDefaults(
  defineProps<{
    locations: TranslatedLocations
    loading?: boolean
  }>(),
  { loading: true }
)

const CONFIG = {
  zoom: 1,
  maxZoom: 17,
  minZoom: 0,
}

const mapRef = useTemplateRef('map')
watchEffect(() => {
  if (!props.loading && mapRef.value) {
    mapRef.value.centerMap()
  }
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
