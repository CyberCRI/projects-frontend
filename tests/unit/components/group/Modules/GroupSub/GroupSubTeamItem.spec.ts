import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupSubTeamItem from '@/components/group/Modules/GroupSub/GroupSubTeamItem.vue'

import { describe, expect, it } from 'vitest'

describe('GroupSubTeamItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupSubTeamItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
