import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupsElement from '@/components/group/GroupsElement/GroupsElement.vue'

import { describe, expect, it } from 'vitest'

describe('GroupsElement.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupsElement, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
