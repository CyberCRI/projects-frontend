import { lpiShallowMount } from '../../../helpers/LpiMount'
import AddToProjectDropdown from '@/components/project/AddToProjectDropdown.vue'
import english from '@/locales/en.json'
import utils from '@/functs/functions'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/functs/functions')
;(utils.hasPermission as Mock).mockImplementation(() => true)

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    ...ProjectOutputFactory.generate(),
                    files: [],
                    links: [],
                }),
            },
        },
        organizations: {
            namespaced: true,
            getters: {
                current: () => OrganizationOutputFactory.generate(),
            },
        },
        users: {
            namespaced: true,
            getters: {
                isConnected: () => true,
                id: () => 123,
            },
        },
    },
}

describe('AddToProjectDropdown', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
            provide: {
                projectLayoutToggleAddModal: vi.fn(),
                projectLayoutGoToTab: vi.fn(),
            },
        }
    })

    it('should render AddToProjectDropdown component', () => {
        wrapper = lpiShallowMount(AddToProjectDropdown, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should render all Button components', () => {
        wrapper = lpiShallowMount(AddToProjectDropdown, defaultParams)
        const vm: any = wrapper.vm

        const buttons = wrapper.findAll('.add-to-project__button')

        expect(buttons.length).toBeGreaterThan(0)
        expect(buttons.length).toBe(vm.menuItems.length)
    })
})
