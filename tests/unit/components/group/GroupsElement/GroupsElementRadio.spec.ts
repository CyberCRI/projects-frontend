import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupsElementRadio from '@/components/group/GroupsElement/GroupsElementRadio.vue'

import { describe, expect, it } from 'vitest'

describe('GroupsElementRadio.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupsElementRadio, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
