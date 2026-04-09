import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupEventTab from '@/pages/GroupPageV2/Tabs/Event/GroupEventTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupEventTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupEventTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
