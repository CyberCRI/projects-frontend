<script setup lang="ts" generic="TLocation extends AnyTranslatedLocation">
import * as L from 'leaflet'

import type { AnyLocation, AnyTranslatedLocation } from '@/models/location.model'
import MarkerIcon from '@/components/map/MarkerIcon.vue'
import { LocationType } from '@/models/types'
import LazyLocationTooltip from '@/components/map/LazyLocationTooltip.vue'

const props = defineProps<{
  locations: TLocation[]
}>()

const addLayers = inject<(l: L.Layer[]) => void>('addLayers')

const locationActive = ref(null)

const markerAddress = useTemplateRef('markerAddress')
const markerImpact = useTemplateRef('markerImpact')
const markerTeam = useTemplateRef('markerTeam')
const markerPopup = useTemplateRef('markerPopup')

const markerToRef = (locationType: LocationType) => {
  switch (locationType) {
    case 'address':
      return markerAddress.value.innerHTML
    case 'impact':
      return markerImpact.value.innerHTML
    case 'team':
      return markerTeam.value.innerHTML
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
  const marker = L.marker([location.lng, location.lat], options).bindPopup(popup, { location })
  return marker
}

watchEffect(async () => {
  const locations = props.locations
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
    locationActive.value = ev.popup.options.location
    console.log('popupopen', ev, ev.popup.options.location)
  })

  mapRaw.on('popupclose', (ev) => {
    locationActive.value = null
    console.log('popupclose', ev, ev.popup.options.location)
  })
})
</script>

<template>
  <div class="hidden">
    <div>
      <div ref="markerAddress"><MarkerIcon location-type="address" /></div>
      <div ref="markerImpact"><MarkerIcon location-type="impact" /></div>
      <div ref="markerTeam"><MarkerIcon location-type="team" /></div>
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
