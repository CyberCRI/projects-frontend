import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import CreateNewsPage from '@/pages/CreateNewsPage/CreateNewsPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe('CreateNewsPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/people-groups-hierarchy/`, () => {
      return {
        id: 1,
        children: [],
      }
    })

    const wrapper = await lpiMountSuspended(CreateNewsPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
