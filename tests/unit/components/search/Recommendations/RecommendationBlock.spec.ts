import { lpiMount } from '@/../tests/helpers/LpiMount'
import RecommendationBlock from '@/components/search/Recommendations/RecommendationBlock.vue'

import { describe, expect, it } from 'vitest'

describe('RecommendationBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(RecommendationBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
