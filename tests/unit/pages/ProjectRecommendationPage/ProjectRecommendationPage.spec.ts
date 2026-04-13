import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import ProjectRecommendationPage from '@/pages/ProjectRecommendationPage/ProjectRecommendationPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectRecommendationPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(ProjectRecommendationPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
