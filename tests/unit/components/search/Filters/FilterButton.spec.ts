import { lpiMount } from '@/../tests/helpers/LpiMount'
import FilterButton from '@/components/search/Filters/FilterButton.vue'

import { describe, expect, it } from 'vitest'

describe('FilterButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FilterButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
