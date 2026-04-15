import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import CreateEventPage from '@/pages/CreateEventPage/CreateEventPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe('CreateEventPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/people-groups-hierarchy/`, () => {
      return {
        id: 1,
        children: [],
      }
    })

    const wrapper = await lpiMountSuspended(CreateEventPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
