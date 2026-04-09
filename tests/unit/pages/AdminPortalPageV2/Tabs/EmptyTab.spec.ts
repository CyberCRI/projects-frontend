import { lpiMount } from '@/../tests/helpers/LpiMount'
import EmptyTab from '@/pages/AdminPortalPageV2/Tabs/EmptyTab.vue'

import { describe, expect, it } from 'vitest'

describe('EmptyTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EmptyTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
