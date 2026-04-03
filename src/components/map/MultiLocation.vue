<script setup lang="ts" generic="TLocation extends AnyTranslatedLocation">
import * as L from 'leaflet'

import type { AnyLocation, AnyTranslatedLocation } from '@/models/location.model'
import MarkerIcon from '@/components/map/MarkerIcon.vue'
import { LocationType } from '@/models/types'
import LazyLocationTooltip from '@/components/map/LazyLocationTooltip.vue'
import { LocationGeneral } from '@/interfaces/maps'

const props = defineProps<{
  locations: TLocation[]
}>()

const { locale } = useNuxtI18n()

const addLayers = inject<(l: L.Layer[]) => void>('addLayers')

const locationActive = ref(null)

const markerAddress = useTemplateRef('markerAddress')
const markerImpact = useTemplateRef('markerImpact')
const markerTeam = useTemplateRef('markerTeam')
const markerNews = useTemplateRef('markerNews')
const markerEvent = useTemplateRef('markerEvent')
const markerPopup = useTemplateRef('markerPopup')

const markerToRef = (locationType: LocationType) => {
  switch (locationType) {
    case 'address':
      return markerAddress.value?.innerHTML || ''
    case 'impact':
      return markerImpact.value?.innerHTML || ''
    case 'team':
      return markerTeam.value?.innerHTML || ''
    case 'event':
      return markerEvent.value?.innerHTML || ''
    case 'news':
      return markerNews.value?.innerHTML || ''
  }
}

const locationToMarker = async (location: AnyLocation) => {
  const svg = markerToRef(location.type)
  const popup = markerPopup.value
  const options = {
    icon: L.divIcon({
      className: `${location.type}`,
      html: svg,
    }),
    location,
  }
  const marker = L.marker({ lat: location.lat, lng: location.lng }, options).bindPopup(popup, {
    // @ts-expect-error location not exists in options popup, but add in to "extras" args
    location,
  })
  return marker
}

watchEffect(async () => {
  const locations = props.locations
  // only to trigger locale change to trigger update marker
  void locale.value
  if (!locations || !addLayers || !import.meta.client) {
    return
  }

  const markers = []
  for (const location of locations) {
    markers.push(await locationToMarker(location))
  }

  addLayers(markers)
})

const map = inject<Ref<L.Map>>('map')
watchEffect(() => {
  const mapRaw = toRaw(map.value)
  mapRaw.on('popupopen', (ev) => {
    // @ts-expect-error location no exists in generalMaps
    const loca = ev.popup.options.location as LocationGeneral
    mapRaw.flyTo({ lat: loca.lat, lng: loca.lng }, Math.max(mapRaw.getZoom(), 5))

    nextTick(() => (locationActive.value = loca))
  })
  mapRaw.on('popupclose', () => {
    locationActive.value = null
  })
})
</script>

<template>
  <div class="hidden">
    <div>
      <div ref="markerAddress"><MarkerIcon location-type="address" /></div>
      <div ref="markerImpact"><MarkerIcon location-type="impact" /></div>
      <div ref="markerTeam"><MarkerIcon location-type="team" /></div>
      <div ref="markerNews"><MarkerIcon location-type="news" /></div>
      <div ref="markerEvent"><MarkerIcon location-type="event" /></div>
    </div>
    <div ref="markerPopup">
      <LazyLocationTooltip v-if="locationActive" :location="locationActive" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.hidden {
  display: none;
}
</style>
