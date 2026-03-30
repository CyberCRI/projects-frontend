import MarkerIcon from '@/components/map/MarkerIcon.vue'
import { IconImageChoice } from '@/functs/IconImage'
import { AnyLocation } from '@/models/location.model'
import { LocationType } from '@/models/types'
import { renderToString } from '@vue/test-utils'
import * as L from 'leaflet'

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
