import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupMembersPreview from '@/components/group/Modules/Members/GroupMembersPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupMembersPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupMembersPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
