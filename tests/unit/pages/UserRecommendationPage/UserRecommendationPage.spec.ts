import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserRecommendationPage from '@/pages/UserRecommendationPage/UserRecommendationPage.vue'

import { describe, expect, it } from 'vitest'

describe('UserRecommendationPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserRecommendationPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
