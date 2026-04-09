import { lpiMount } from '@/../tests/helpers/LpiMount'
import ReviewItem from '@/components/project/review/ReviewItem.vue'

import { describe, expect, it } from 'vitest'

describe('ReviewItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ReviewItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
