import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryPicker from '@/components/category/CategoryPicker.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryPicker.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryPicker, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
