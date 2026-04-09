import { lpiMount } from '@/../tests/helpers/LpiMount'
import PortalPage from '@/pages/PortalPage/PortalPage.vue'

import { describe, expect, it } from 'vitest'

describe('PortalPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PortalPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
