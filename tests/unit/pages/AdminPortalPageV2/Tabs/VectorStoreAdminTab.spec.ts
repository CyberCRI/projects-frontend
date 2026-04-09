import { lpiMount } from '@/../tests/helpers/LpiMount'
import VectorStoreAdminTab from '@/pages/AdminPortalPageV2/Tabs/VectorStoreAdminTab.vue'

import { describe, expect, it } from 'vitest'

describe('VectorStoreAdminTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(VectorStoreAdminTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
