import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupsListTab from '@/pages/AdminPortalPageV2/Tabs/GroupsListTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupsListTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupsListTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
