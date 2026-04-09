import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupMembersEditTab from '@/pages/GroupPageV2/Tabs/Members/GroupMembersEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupMembersEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupMembersEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
