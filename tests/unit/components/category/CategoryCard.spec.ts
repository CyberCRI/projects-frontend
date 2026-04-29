import CategoryCard from '~/components/category/CategoryCard.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { ProjectCategoryFactory } from '~~/tests/factories/project-category.factory'
import { describe, expect, it } from 'vitest'

describe('CategoryCard.vue', () => {
  it('should render component', () => {
    const category = ProjectCategoryFactory.generate()
    const wrapper = lpiMount(CategoryCard, { props: { category } })
    expect(wrapper.exists()).toBe(true)
  })
})
