import MarkerIcon from '@/components/map/MarkerIcon.vue'
import { IconImageChoice } from '@/functs/IconImage'
import { AnyLocation } from '@/models/location.model'
import { LocationType } from '@/models/types'
import { renderToString } from '@vue/test-utils'

export const IconMapLocationType = (locationType: LocationType): IconImageChoice => {
  switch (locationType) {
    case 'impact':
      return 'Sun'
    case 'team':
      return 'Users'
    case 'address':
      return 'Home'
    default:
      return 'Alert'
  }
}

export const locationToMarker = (location: AnyLocation) => {
  const locationToMarker = async (locations: AnyTranslatedLocation[]) => {
    const markers: L.Marker[] = []
    const svg = await renderToString(MarkerIcon, { props: { location: locations[0] } })

    for (const location of locations) {
      const options = {
        icon: L.divIcon({
          className: `${location.type}`,
          html: svg,
          // @ts-expect-error ignore set
          location,
        }),
      }
      const marker = L.marker([location.lng, location.lat], options).bindPopup(`${location.title}`)
      markers.push(marker)
    }
    return markers
  }
}
