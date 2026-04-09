import { lpiMount } from '@/../tests/helpers/LpiMount'
import SubGroupsTab from '@/pages/GroupPageV2/Tabs/SubGroups/SubGroupsTab.vue'

import { describe, expect, it } from 'vitest'

describe('SubGroupsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SubGroupsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
