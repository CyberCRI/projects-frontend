import { lpiMount } from '@/../tests/helpers/LpiMount'
import PortalPage from '@/pages/PortalPage/PortalPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('PortalPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(PortalPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
