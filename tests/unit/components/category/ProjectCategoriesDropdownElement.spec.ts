import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectCategoriesDropdownElement from '@/components/category/ProjectCategoriesDropdownElement.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectCategoriesDropdownElement.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectCategoriesDropdownElement, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
