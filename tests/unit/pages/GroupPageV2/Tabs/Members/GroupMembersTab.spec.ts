import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupMembersTab from '@/pages/GroupPageV2/Tabs/Members/GroupMembersTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupMembersTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupMembersTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
