import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import MapPage from '~/pages/MapPage/MapPage.vue'
import { flushPromises } from '@vue/test-utils'
import { Locations } from '~/interfaces/maps'

import { describe, expect, it } from 'vitest'

describe('MapPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/location/`, () => {
      return {
        event: [],
        groups: [],
        news: [],
        projects: [],
      } satisfies Locations
    })

    const wrapper = await lpiMountSuspended(MapPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
