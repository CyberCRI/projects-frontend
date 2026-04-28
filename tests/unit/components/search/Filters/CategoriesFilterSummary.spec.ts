import CategoriesFilterSummary from '~/components/search/Filters/CategoriesFilterSummary.vue'
import { ProjectCategoryOutputFactory } from '~~/tests/factories/project-category.factory'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import useProjectCategoriesStore from '~/stores/useProjectCategories'
import { beforeEach, describe, expect, it } from 'vitest'
import pinia from '~/stores'

describe('CategoriesFilterEditor.vue', () => {
  beforeEach(() => {
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories._all = ProjectCategoryOutputFactory.generateMany(8)
  })
  it('should render component', () => {
    const wrapper = lpiMount(CategoriesFilterSummary, { props: { modelValue: [] } })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display category buttons', () => {
    const wrapper = lpiMount(CategoriesFilterSummary, {
      props: { modelValue: ProjectCategoryOutputFactory.generateMany(8) },
    })
    const buttonContainers = wrapper.findAll('.filter-value')

    expect(buttonContainers.length).toBe(8)
  })

  it('should emit event update is triggered', async () => {
    const wrapper = lpiMount(CategoriesFilterSummary, {
      props: { modelValue: ProjectCategoryOutputFactory.generateMany(8) },
    })

    const buttonContainer = wrapper.find('.filter-value')
    buttonContainer.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
