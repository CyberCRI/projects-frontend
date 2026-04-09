import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectCategoriesDropdown from '@/components/category/ProjectCategoriesDropdown.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectCategoriesDropdown.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectCategoriesDropdown, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
