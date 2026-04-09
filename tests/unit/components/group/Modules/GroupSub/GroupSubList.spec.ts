import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'

import { describe, expect, it } from 'vitest'

describe('GroupSubList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupSubList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
