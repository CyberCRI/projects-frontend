import { lpiMount } from '@/../tests/helpers/LpiMount'
import SearchFilters from '@/components/search/Filters/SearchFilters.vue'

import { describe, expect, it } from 'vitest'

describe('SearchFilters.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SearchFilters, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
