import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryField from '@/components/category/CategoryField.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryField.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryField, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
