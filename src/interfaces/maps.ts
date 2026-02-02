import { GeneralLocationPeopleGroup, PeopleGroupModel } from '@/models/invitation.model'
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

export type Locations = {
  groups: PeopleGroupModel[]
  projects: LocationModel[]
}

export type TranslatedLocations = {
  groups: GeneralLocationPeopleGroup[]
  projects: TranslatedLocation[]
}
