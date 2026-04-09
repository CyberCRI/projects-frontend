import { lpiMount } from '@/../tests/helpers/LpiMount'
import AdminPortalPage from '@/pages/AdminPortalPageV2/AdminPortalPage.vue'

import { describe, expect, it } from 'vitest'

describe('AdminPortalPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AdminPortalPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
