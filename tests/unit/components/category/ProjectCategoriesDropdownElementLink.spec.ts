import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectCategoriesDropdownElementLink from '@/components/category/ProjectCategoriesDropdownElementLink.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectCategoriesDropdownElementLink.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectCategoriesDropdownElementLink, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
