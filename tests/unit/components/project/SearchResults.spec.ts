import { lpiMount } from '@/../tests/helpers/LpiMount'
import SearchResults from '@/components/project/SearchResults.vue'

import { describe, expect, it } from 'vitest'

describe('SearchResults.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SearchResults, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
