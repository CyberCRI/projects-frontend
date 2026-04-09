import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

import { describe, expect, it } from 'vitest'

describe('BaseGroupTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseGroupTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
