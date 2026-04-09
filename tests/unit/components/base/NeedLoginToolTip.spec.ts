import { lpiMount } from '@/../tests/helpers/LpiMount'
import NeedLoginToolTip from '@/components/base/NeedLoginToolTip.vue'

import { describe, expect, it } from 'vitest'

describe('NeedLoginToolTip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NeedLoginToolTip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
