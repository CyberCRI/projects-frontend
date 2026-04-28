import GroupLocationsTab from '~/pages/GroupPageV2/Tabs/Locations/GroupLocationsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { groupTranslatedFactory } from '~~/tests/factories/group.factory'
import LocationFactory from '~~/tests/factories/location.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

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
