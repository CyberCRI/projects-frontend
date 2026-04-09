import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupLocationToolTip from '@/components/group/Map/GroupLocationToolTip.vue'

import { describe, expect, it } from 'vitest'

describe('GroupLocationToolTip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupLocationToolTip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
