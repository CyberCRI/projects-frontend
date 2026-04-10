import { lpiMount, lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import GroupLocationsTab from '@/pages/GroupPageV2/Tabs/Locations/GroupLocationsTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { groupTranslatedFactory } from '../../../../../factories/group.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../../factories/paginations.factory'
import LocationFactory from '../../../../../factories/location.factory'

describe('GroupLocationsTab.vue', () => {
  it('should render component', async () => {
    const group = groupTranslatedFactory.generate()
    const props = { group }

    const organizationCode = useOrganizationCode()
    registerEndpoint(
      `organization/${organizationCode}/people-group/${group.id}/all-locations/`,
      () => {
        return LocationFactory.generateMany(10)
      }
    )

    const wrapper = await lpiMountSuspended(GroupLocationsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
