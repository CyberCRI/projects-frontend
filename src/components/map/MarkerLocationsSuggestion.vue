<script setup lang="ts" generic="TLocation extends AnyLocation">
import * as L from 'leaflet'

import type { AnyLocation } from '@/models/location.model'
import { throttle } from 'es-toolkit'
import MarkerSuggestion from '@/components/map/MarkerSuggestion.vue'

export type MarkerSugestion = {
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

const locationToMarker = (location: AnyLocation, info: MarkerSugestion) => {
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

const markerSuggestion = ref(new Map())
const add = (location: TLocation, info: MarkerSugestion) => {
  markerSuggestion.value.set(location, info)
}

const remove = (location: TLocation) => {
  markerSuggestion.value.delete(location)
}

watchEffect(
  throttle(async () => {
    console.log('throttle')
    const locations = markerSuggestion.value
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

    const markers = []
    for (const [location, info] of locations) {
      markers.push(layers.get(location) || locationToMarker(location, info))
    }

    addLayers(markers)
    nextTick(() => firstCenterMap())
  }, 300)
)
</script>

<template>
  <div class="hidden">
    <MarkerSuggestion
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
