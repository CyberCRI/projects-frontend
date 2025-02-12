import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoriesFilterEditor from '@/components/search/Filters/CategoriesFilterEditor.vue'
import { ProjectCategoryOutputFactory } from '@/../tests/factories/project-category.factory'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import pinia from '@/stores'
import useProjectCategoriesStore from '@/stores/useProjectCategories'

const factory = (props?) => {
    return lpiMount(CategoriesFilterEditor, {
        props: {
            ...props,
        },
    })
}

describe('CategoriesFilterEditor.vue', () => {
    beforeEach(() => {
        const projectCategories = useProjectCategoriesStore(pinia)
        projectCategories.all = ProjectCategoryOutputFactory.generateMany(8)
    })

    it('should render component', () => {
        const wrapper = factory({ modelValue: [] })
        expect(wrapper.exists()).toBe(true)
    })

    it('should display category buttons', () => {
        const wrapper = factory({ modelValue: [] })
        const buttonContainers = wrapper.findAll('.category-picker-element')

        expect(buttonContainers.length).toBe(8)
    })

    it('should emit event update is triggered', async () => {
        const wrapper = factory({ modelValue: [] })
        const vm: any = wrapper.vm

        const buttonContainer = wrapper.find('.category-picker-element input')
        buttonContainer.trigger('input')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
})
