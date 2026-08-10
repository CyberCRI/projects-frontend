import type { AnyLocation, BaseLocationModel } from 'shared-projects-frontend/models'

export type Geocoding = BaseLocationModel & {
  label?: string
}

export type MapPointerOption = {
  markerContent: HTMLElement
  location: AnyLocation
  tooltip?: HTMLElement
}
