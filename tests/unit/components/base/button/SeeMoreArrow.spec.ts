import { lpiMount } from '@/../tests/helpers/LpiMount'
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'

import { describe, expect, it } from 'vitest'

describe('SeeMoreArrow.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SeeMoreArrow, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
