import {
  AnyLocation,
  BaseLocationModel,
  LocationModel,
  TranslatedLocation,
} from '@/models/location.model'

export type Geocoding = BaseLocationModel & {
  label?: string
}

export type MapPointerOption = {
  markerContent: HTMLElement
  location: AnyLocation
  tooltip?: HTMLElement
}

export type Locations = LocationModel[]

export type TranslatedLocations = TranslatedLocation[]
