import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupsTab from '@/pages/AdminPortalPageV2/Tabs/GroupsTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
