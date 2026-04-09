import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserRecommendationItemSkeleton from '@/components/search/Recommendations/UserRecommendationItemSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('UserRecommendationItemSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserRecommendationItemSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
