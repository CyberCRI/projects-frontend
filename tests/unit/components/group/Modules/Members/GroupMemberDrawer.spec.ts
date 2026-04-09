import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupMemberDrawer from '@/components/group/Modules/Members/GroupMemberDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('GroupMemberDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupMemberDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
