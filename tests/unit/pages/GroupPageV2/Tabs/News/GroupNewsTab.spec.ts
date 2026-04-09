import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupNewsTab from '@/pages/GroupPageV2/Tabs/News/GroupNewsTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupNewsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupNewsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
