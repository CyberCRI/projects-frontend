import { lpiMount } from '@/../tests/helpers/LpiMount'
import RecommendationListSkeleton from '@/components/search/Recommendations/RecommendationListSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('RecommendationListSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(RecommendationListSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
