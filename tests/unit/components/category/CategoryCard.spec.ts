import { lpiMount } from '~~/tests/helpers/LpiMount'
import CategoryCard from '~/components/category/CategoryCard.vue'

import { describe, expect, it } from 'vitest'
import { ProjectCategoryFactory } from '../../../factories/project-category.factory'

describe('CategoryCard.vue', () => {
  it('should render component', () => {
    const category = ProjectCategoryFactory.generate()
    const wrapper = lpiMount(CategoryCard, { props: { category } })
    expect(wrapper.exists()).toBe(true)
  })
})
