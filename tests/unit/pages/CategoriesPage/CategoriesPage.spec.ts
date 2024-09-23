import CategoriesPage from '@/pages/CategoriesPage/CategoriesPage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import MockComponent from '../../../helpers/MockComponent.vue'
import { describe, expect, it } from 'vitest'

const store = {
    modules: {
        // projectCategories: {
        //     namespaced: true,
        //     getters: {
        //         hierarchy: vi.fn().mockReturnValue([]),
        //     },
        // },
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
    it('should render CategoriesPage', () => {
        let wrapper = lpiShallowMount(CategoriesPage, { store, router })

        expect(wrapper.exists()).toBeTruthy()
    })
})
