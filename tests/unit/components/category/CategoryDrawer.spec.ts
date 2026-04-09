import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryDrawer from '@/components/category/CategoryDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
