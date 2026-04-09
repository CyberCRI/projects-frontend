import { lpiMount } from '@/../tests/helpers/LpiMount'
import FiltersDrawer from '@/components/search/Filters/FiltersDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('FiltersDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FiltersDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
