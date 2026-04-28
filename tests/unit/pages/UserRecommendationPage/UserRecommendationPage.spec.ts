import UserRecommendationPage from '~/pages/UserRecommendationPage/UserRecommendationPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('UserRecommendationPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(UserRecommendationPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
