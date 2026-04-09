import { lpiMount } from '@/../tests/helpers/LpiMount'
import FilterWrapper from '@/components/search/Filters/FilterWrapper.vue'

import { describe, expect, it } from 'vitest'

describe('FilterWrapper.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FilterWrapper, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
