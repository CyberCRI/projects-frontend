import { lpiMount } from '@/../tests/helpers/LpiMount'
import PickGroupDrawer from '@/components/group/PickGroupDrawer/PickGroupDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('PickGroupDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PickGroupDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
