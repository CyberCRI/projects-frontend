import { lpiMount } from '../../../../helpers/LpiMount'
import CategoriesFilterEditor from '@/components/search/Filters/CategoriesFilterEditor.vue'
import { ProjectCategoryOutputFactory } from '../../../../factories/project-category.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
function buildStore() {
    return {
        modules: {
            projectCategories: {
                namespaced: true,
                getters: {
                    hierarchy: () => ProjectCategoryOutputFactory.generateMany(8),
                },
            },
        },
    }
}

const factory = (props?) => {
    return lpiMount(CategoriesFilterEditor, {
        props: {
            ...props,
        },
        store: buildStore(),
    })
}

describe('CategoriesFilterEditor.vue', () => {
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
        const wrapper = factory({ modelValue: [], triggerUpdate: true })
        const vm: any = wrapper.vm

        const buttonContainer = wrapper.find('.category-picker-element input')
        buttonContainer.trigger('input')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
})
