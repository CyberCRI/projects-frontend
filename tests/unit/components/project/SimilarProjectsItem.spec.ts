import { lpiMount } from '@/../tests/helpers/LpiMount'
import SimilarProjectsItem from '@/components/project/SimilarProjectsItem.vue'

import { describe, expect, it } from 'vitest'

describe('SimilarProjectsItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SimilarProjectsItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
