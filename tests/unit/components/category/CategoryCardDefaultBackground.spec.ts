import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryCardDefaultBackground from '@/components/category/CategoryCardDefaultBackground.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryCardDefaultBackground.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryCardDefaultBackground, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
