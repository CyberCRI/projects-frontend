import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryAdminElement from '@/components/category/CategoryAdminElement.vue'

import { describe, expect, it } from 'vitest'

describe('CategoryAdminElement.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoryAdminElement, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
