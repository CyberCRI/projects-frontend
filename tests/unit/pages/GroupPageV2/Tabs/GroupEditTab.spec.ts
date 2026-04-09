import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupEditTab from '@/pages/GroupPageV2/Tabs/GroupEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
