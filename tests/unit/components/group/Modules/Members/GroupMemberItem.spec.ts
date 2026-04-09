import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'

import { describe, expect, it } from 'vitest'

describe('GroupMemberItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupMemberItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
