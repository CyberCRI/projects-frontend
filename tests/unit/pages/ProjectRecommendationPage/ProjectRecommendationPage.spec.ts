import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectRecommendationPage from '@/pages/ProjectRecommendationPage/ProjectRecommendationPage.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectRecommendationPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectRecommendationPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
