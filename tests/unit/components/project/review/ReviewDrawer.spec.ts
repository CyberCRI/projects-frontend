import { lpiMount } from '@/../tests/helpers/LpiMount'
import ReviewDrawer from '@/components/project/review/ReviewDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ReviewDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ReviewDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
