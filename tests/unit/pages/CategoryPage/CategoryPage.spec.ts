import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryPage from '@/pages/CategoryPage/CategoryPage.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
