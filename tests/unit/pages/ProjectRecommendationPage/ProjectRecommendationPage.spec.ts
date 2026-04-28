import ProjectRecommendationPage from '~/pages/ProjectRecommendationPage/ProjectRecommendationPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectRecommendationPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(ProjectRecommendationPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
