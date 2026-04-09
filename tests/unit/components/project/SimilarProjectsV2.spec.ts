import { lpiMount } from '@/../tests/helpers/LpiMount'
import SimilarProjectsV2 from '@/components/project/SimilarProjectsV2.vue'

import { describe, expect, it } from 'vitest'

describe('SimilarProjectsV2.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SimilarProjectsV2, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
