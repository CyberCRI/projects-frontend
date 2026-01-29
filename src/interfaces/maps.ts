import { TranslatedLocation } from '@/models/location.model'

export type MapPointerOption = {
  markerContent: HTMLElement
  location: TranslatedLocation
  tooltip?: HTMLElement
}
