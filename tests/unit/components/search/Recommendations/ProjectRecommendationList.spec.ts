import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectRecommendationList from '@/components/search/Recommendations/ProjectRecommendationList.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectRecommendationList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectRecommendationList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
