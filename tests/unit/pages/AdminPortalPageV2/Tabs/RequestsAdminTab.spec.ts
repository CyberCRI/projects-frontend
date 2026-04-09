import { lpiMount } from '@/../tests/helpers/LpiMount'
import RequestsAdminTab from '@/pages/AdminPortalPageV2/Tabs/RequestsAdminTab.vue'

import { describe, expect, it } from 'vitest'

describe('RequestsAdminTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(RequestsAdminTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
