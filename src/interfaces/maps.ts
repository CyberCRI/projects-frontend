import type {
  AnyLocation,
  BaseLocationModel,
  EventLocation,
  LocationModel,
  NewsLocation,
  TranslatedEventLocation,
  TranslatedLocation,
  TranslatedNewsLocation,
} from '~/models/location.model'
import type { GeneralLocationPeopleGroup, PeopleGroupModel } from '~/models/invitation.model'

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
  news: NewsLocation[]
  event: EventLocation[]
}

export type TranslatedLocations = {
  groups: GeneralLocationPeopleGroup[]
  projects: TranslatedLocation[]
  news: TranslatedNewsLocation[]
  event: TranslatedEventLocation[]
}
