import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectRecommendationItemSkeleton from '@/components/search/Recommendations/ProjectRecommendationItemSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectRecommendationItemSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectRecommendationItemSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
