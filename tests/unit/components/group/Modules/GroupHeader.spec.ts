import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupHeader from '@/components/group/Modules/GroupHeader.vue'

import { describe, expect, it } from 'vitest'

describe('GroupHeader.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupHeader, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
