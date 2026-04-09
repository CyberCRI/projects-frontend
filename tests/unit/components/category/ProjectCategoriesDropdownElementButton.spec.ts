import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectCategoriesDropdownElementButton from '@/components/category/ProjectCategoriesDropdownElementButton.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectCategoriesDropdownElementButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectCategoriesDropdownElementButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
