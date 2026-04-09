import { lpiMount } from '@/../tests/helpers/LpiMount'
import SdgsDrawer from '@/components/sdgs/SdgsDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('SdgsDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SdgsDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
