import { IconImageChoice } from '@/functs/IconImage'
import { LocationType } from '@/models/types'

export const IconMapLocationType = (locationType: LocationType): IconImageChoice => {
  switch (locationType) {
    case 'impact':
      return 'Sun'
    case 'team':
      return 'Users'
  }
}
