import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserRecommendationList from '@/components/search/Recommendations/UserRecommendationList.vue'

import { describe, expect, it } from 'vitest'

describe('UserRecommendationList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserRecommendationList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
