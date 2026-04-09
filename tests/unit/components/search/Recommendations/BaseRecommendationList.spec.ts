import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseRecommendationList from '@/components/search/Recommendations/BaseRecommendationList.vue'

import { describe, expect, it } from 'vitest'

describe('BaseRecommendationList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseRecommendationList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
