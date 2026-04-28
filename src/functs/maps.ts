import type { LocationType } from '~/models/types'

import type { IconImageChoice } from '~/functs/IconImage'

export const IconMapLocationType = (locationType: LocationType): IconImageChoice => {
  switch (locationType) {
    case 'impact':
      return 'Sun'
    case 'team':
      return 'Users'
    case 'address':
      return 'Home'
    case 'news':
      return 'NewsLine'
    case 'event':
      return 'Calendar'
  }
}
