<script setup lang="ts" generic="TLocation extends AnyLocation">
import * as L from 'leaflet'

import type { AnyLocation } from '@/models/location.model'
import { throttle } from 'es-toolkit'
import MarkerDynamic from '@/components/map/MarkerDynamic.vue'

export type MarkerDynamicInfo = {
  marker: HTMLElement
}

defineProps<{
  locations: TLocation[]
}>()
defineEmits<{ click: [TLocation] }>()
const { locale } = useNuxtI18n()

const first = ref(true)

const centerMap = inject<() => void>('centerMap')
const addLayers = inject<(l: L.Layer[]) => void>('addLayers')
const getLayers = inject<() => L.Layer[]>('getLayers')

const locationToMarker = (location: AnyLocation, info: MarkerDynamicInfo) => {
  const options = {
    icon: L.divIcon({
      className: `${location.type}`,
      html: info.marker,
    }),
    location,
  }
  return L.marker({ lat: location.lat, lng: location.lng }, options)
}

const firstCenterMap = () => {
  if (first.value) {
    centerMap()
    first.value = false
  }
}

const markers = ref(new Map())
const add = (location: TLocation, info: MarkerDynamicInfo) => {
  markers.value.set(location, info)
}

const remove = (location: TLocation) => {
  markers.value.delete(location)
}

watchEffect(
  throttle(async () => {
    const locations = markers.value
    // only to trigger locale change to trigger update marker
    void locale.value
    if (!locations || !addLayers || !import.meta.client) {
      return
    }

    // create a mapping to cache/get exists same layer
    const layers = new Map()
    for (const layer of getLayers()) {
      // @ts-expect-error location in options
      layers.set(layer.options.location, layer)
    }

    const newMarkers = []
    for (const [location, info] of locations) {
      newMarkers.push(layers.get(location) || locationToMarker(location, info))
    }

    addLayers(newMarkers)
    nextTick(() => firstCenterMap())
  }, 300)
)
</script>

<template>
  <div class="hidden">
    <MarkerDynamic
      v-for="location in locations"
      :key="JSON.stringify(location)"
      :location="location"
      @mounted="add"
      @unmounted="remove"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<style lang="css" scoped>
.hidden {
  display: none;
}
</style>
