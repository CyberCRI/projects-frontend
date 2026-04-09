import { lpiMount } from '@/../tests/helpers/LpiMount'
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'

import { describe, expect, it } from 'vitest'

describe('SearchOptions.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SearchOptions, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
