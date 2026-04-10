import { lpiMount } from '@/../tests/helpers/LpiMount'
import { Locations } from '@/interfaces/maps'
import MapPage from '@/pages/MapPage/MapPage.vue'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import flushPromises from 'flush-promises'

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

    const props = {}

    const wrapper = await lpiMount(MapPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
