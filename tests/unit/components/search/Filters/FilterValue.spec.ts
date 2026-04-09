import { lpiMount } from '@/../tests/helpers/LpiMount'
import FilterValue from '@/components/search/Filters/FilterValue.vue'

import { describe, expect, it } from 'vitest'

describe('FilterValue.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FilterValue, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
