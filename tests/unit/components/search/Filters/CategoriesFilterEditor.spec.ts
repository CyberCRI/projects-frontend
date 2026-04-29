import CategoriesFilterEditor from '~/components/search/Filters/CategoriesFilterEditor.vue'
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
    const wrapper = lpiMount(CategoriesFilterEditor, { props: { modelValue: [] } })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display category buttons', () => {
    const wrapper = lpiMount(CategoriesFilterEditor, { props: { modelValue: [] } })
    const buttonContainers = wrapper.findAll('.category-picker-element')

    expect(buttonContainers.length).toBe(8)
  })

  it('should emit event update is triggered', async () => {
    const wrapper = lpiMount(CategoriesFilterEditor, { props: { modelValue: [] } })

    const buttonContainer = wrapper.find('.category-picker-element input')
    buttonContainer.trigger('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
