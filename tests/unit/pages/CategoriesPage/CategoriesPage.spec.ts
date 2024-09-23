import CategoriesPage from '@/pages/CategoriesPage/CategoriesPage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import MockComponent from '../../../helpers/MockComponent.vue'
import { describe, expect, it } from 'vitest'

import english from '@/locales/en.json'
import { ProjectCategoryOutputFactory } from '../../../factories/project-category.factory'
import pinia from '@/stores'
import useProjectCategoriesStore from '@/stores/useProjectCategories'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        organizations: {
            state: {
                current: { id: 'TEST', code: 'TEST' },
            },
            namespaced: true,
            getters: {
                current: vi.fn().mockReturnValue({ id: 'TEST', code: 'TEST' }),
            },
        },
    },
}

const router = [{ name: 'Home', path: '/', component: MockComponent }]

describe('CategoriesPage', () => {
    beforeEach(() => {
        const projectCategories = useProjectCategoriesStore(pinia)
        projectCategories.all = ProjectCategoryOutputFactory.generateMany(8)
    })
    it('should render CategoriesPage', () => {
        let wrapper = lpiShallowMount(CategoriesPage, { store, router, i18n })

        expect(wrapper.exists()).toBeTruthy()
    })
})
