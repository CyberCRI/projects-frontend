import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryCardImage from '@/components/category/CategoryCardImage.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryCardImage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryCardImage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
