import { Translated } from '@/interfaces/translated'
import { AnyLocation, BaseLocationModel } from '@/models/location.model'

export type Geocoding = BaseLocationModel & {
  label?: string
}

export type MapPointerOption = {
  markerContent: HTMLElement
  location: AnyLocation
  tooltip?: HTMLElement
}

export type LocationGeneral = BaseLocationModel & {
  content_id: string
  content_type: 'project' | 'people_group' | 'event' | 'news'
}

export type TranslatedLocationGeneral = Translated<LocationGeneral, 'title' | 'description'>
