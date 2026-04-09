import { lpiMount } from '@/../tests/helpers/LpiMount'
import PickGroup from '@/components/group/PickGroup/PickGroup.vue'

import { describe, expect, it } from 'vitest'

describe('PickGroup.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PickGroup, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
