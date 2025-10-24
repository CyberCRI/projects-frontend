import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoriesFilterSummary from '@/components/search/Filters/CategoriesFilterSummary.vue'
import { ProjectCategoryOutputFactory } from '@/../tests/factories/project-category.factory'

import pinia from '@/stores'
import useProjectCategoriesStore from '@/stores/useProjectCategories'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

const factory = (props?) => {
  return lpiMount(CategoriesFilterSummary, {
    props: {
      ...props,
    },
  })
}

describe('CategoriesFilterEditor.vue', () => {
  beforeEach(() => {
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories._all = ProjectCategoryOutputFactory.generateMany(8)
  })
  it('should render component', () => {
    const wrapper = factory({ modelValue: [] })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display category buttons', () => {
    const wrapper = factory({ modelValue: ProjectCategoryOutputFactory.generateMany(8) })
    const buttonContainers = wrapper.findAll('.filter-value')

    expect(buttonContainers.length).toBe(8)
  })

  it('should emit event update is triggered', async () => {
    const wrapper = factory({ modelValue: ProjectCategoryOutputFactory.generateMany(8) })
    const vm: any = wrapper.vm

    const buttonContainer = wrapper.find('.filter-value')
    buttonContainer.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
