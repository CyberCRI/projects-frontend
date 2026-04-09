import { lpiMount } from '@/../tests/helpers/LpiMount'
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'

import { describe, expect, it } from 'vitest'

describe('FilterSearchInput.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FilterSearchInput, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
