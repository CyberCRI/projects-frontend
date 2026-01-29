import { TranslatedLocation } from '@/models/location.model'

export type Geocoding = {
  id: string
  label: string
  lat: number
  lng: number
  latlng: {
    lat: number
    lng: number
  }
  type: 'locality' | 'country' | 'route'
}

export type MapPointerOption = {
  markerContent: HTMLElement
  location: TranslatedLocation | Geocoding
  tooltip?: HTMLElement
}
