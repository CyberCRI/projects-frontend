import { lpiShallowMount } from '../../../helpers/LpiMount'
import ProjectTabs from '@/components/project/ProjectTabs.vue'
import { ProjectFactory, ProjectOutputFactory } from '../../../factories/project.factory'
import english from '@/locales/en.json'
import { ProjectCategoryOutputFactory } from '../../../factories/project-category.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const route = {
    params: {
        slugOrId: '13',
    },
}

const store = {
    modules: {
        projectCategories: {
            namespaced: true,
            getters: {
                allOrderedByOrderId: vi.fn(() => ProjectCategoryOutputFactory.generateMany(2)),
            },
        },

        organizations: {
            namespaced: true,
            getters: {
                current: () => ({
                    id: 123,
                }),
            },
        },
    },
}

const factory = (props?) => {
    return lpiShallowMount(ProjectTabs, {
        props: {
            project: ProjectOutputFactory.generate(),
            ...props,
        },
        i18n,
        store,
        global: {
            mocks: {
                $route: route,
            },
        },
    })
}

describe('ProjectTabs.vue', () => {
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })

    it('should toggle add-to-project', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        expect(vm.addToProjectMenuVisible).toBe(false)
        vm.toggleAddToProject()
        expect(vm.addToProjectMenuVisible).toBe(true)
        vm.toggleAddToProject()
        expect(vm.addToProjectMenuVisible).toBe(false)
    })

    it('should toggle project config', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        vm.addToProjectMenuVisible = true
        expect(vm.addToProjectMenuVisible).toBe(true)
    })
})
