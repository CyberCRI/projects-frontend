import { lpiMount } from '../../../../helpers/LpiMount'
import CategoriesFilterSummary from '@/components/lpikit/Filters/CategoriesFilterSummary.vue'
import { ProjectCategoryOutputFactory } from '../../../../factories/project-category.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
function buildStore() {
    return {
        modules: {
            projectCategories: {
                namespaced: true,
                getters: {
                    all: () => ProjectCategoryOutputFactory.generateMany(8),
                },
            },
        },
    }
}

const factory = (props?) => {
    return lpiMount(CategoriesFilterSummary, {
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
