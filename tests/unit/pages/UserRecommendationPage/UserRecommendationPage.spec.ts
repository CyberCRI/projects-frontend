import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserRecommendationPage from '@/pages/UserRecommendationPage/UserRecommendationPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('UserRecommendationPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(UserRecommendationPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
