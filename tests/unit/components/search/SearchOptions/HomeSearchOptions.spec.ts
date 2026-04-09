import { lpiMount } from '@/../tests/helpers/LpiMount'
import HomeSearchOptions from '@/components/search/SearchOptions/HomeSearchOptions.vue'

import { describe, expect, it } from 'vitest'

describe('HomeSearchOptions.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HomeSearchOptions, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
