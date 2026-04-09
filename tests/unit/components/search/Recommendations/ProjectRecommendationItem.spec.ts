import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectRecommendationItem from '@/components/search/Recommendations/ProjectRecommendationItem.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectRecommendationItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectRecommendationItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
