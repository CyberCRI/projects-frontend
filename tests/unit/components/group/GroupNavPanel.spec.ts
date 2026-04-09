import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupNavPanel from '@/components/group/GroupNavPanel.vue'

import { describe, expect, it } from 'vitest'

describe('GroupNavPanel.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupNavPanel, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
