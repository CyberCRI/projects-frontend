import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserRecommendationItem from '@/components/search/Recommendations/UserRecommendationItem.vue'

import { describe, expect, it } from 'vitest'

describe('UserRecommendationItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserRecommendationItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
