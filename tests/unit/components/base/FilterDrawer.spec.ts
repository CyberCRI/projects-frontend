import { lpiMount } from '@/../tests/helpers/LpiMount'
import FilterDrawer from '@/components/base/FilterDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('FilterDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FilterDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
