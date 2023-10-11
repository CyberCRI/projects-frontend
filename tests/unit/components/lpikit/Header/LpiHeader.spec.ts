import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import LpiHeader from '@/components/Header/LpiHeader.vue'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import { ProjectCategoryOutputFactory } from '../../../../factories/project-category.factory'
import MockComponent from '../../../../helpers/MockComponent.vue'

import { axios } from '@/api/api.config'
// quick fix for vi error
// "Cannot log after tests are done. Did you forget to wait for something async in your test?"
// caused by error log af failing call to fetch announcement in LpiHeader
vi.mock('@/api/api.config', function () {
    return {
        axios: {
            get: vi.fn().mockResolvedValue({ data: { results: [] } }),
        },
    }
})

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const organization = OrganizationOutputFactory.generate()
const organizations = OrganizationOutputFactory.generateMany(2)
const roles = ['superadmins', `organization:#${organization.id}:admins`]
const permissions = {}
const user = {
    name: {
        firstname: 'test',
        lastname: 'test',
    },
}
const store = {
    modules: {
        users: {
            namespaced: true,
            getters: {
                isConnected: () => false,
                getUserRoles: () => roles,
                getPermissions: () => permissions,
                user: () => user,
            },
            state: {
                roles: roles,
                permissions: permissions,
            },
        },
        organizations: {
            namespaced: true,
            getters: {
                current: () => organization,
                all: () => organizations,
            },
        },
        projectCategories: {
            namespaced: true,
            actions: {
                getAllProjectCategories: () => ProjectCategoryOutputFactory.generateMany(2),
            },
            getters: {
                all: () => ProjectCategoryOutputFactory.generateMany(2),
            },
        },

        languages: {
            namespaced: true,
            getters: {
                current: () => 'en',
                all: () => ['en', 'fr'],
            },
        },
    },
}

describe('LpiHeader.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {},
            i18n,
            store,
            router: [
                { path: '/', component: MockComponent },
                { path: '/blank', component: MockComponent, name: 'blank' },
            ],
        }
    })

    it('should render LpiHeader component', () => {
        wrapper = lpiShallowMount(LpiHeader, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should trigger the change visibility button', () => {
        wrapper = lpiShallowMount(LpiHeader, defaultParams)

        const isNavOpen = wrapper.vm.$data.isNavOpen
        const loginButton = wrapper.find('[data-test="login-button"]')

        expect(isNavOpen).toBe(false)
        expect(loginButton.exists()).toBeTruthy()
    })

    it('should find the language button', () => {
        wrapper = lpiShallowMount(LpiHeader, defaultParams)

        const langButton = wrapper.find('header-drop-down-stub')

        expect(langButton.exists()).toBe(true)
    })

    it('should find the drawers', () => {
        wrapper = lpiShallowMount(LpiHeader, defaultParams)

        const drawers = wrapper.findAll('drawer-layout-stub')
        // Notifications and contact form
        expect(drawers.length).toEqual(2)
    })

    it('should find the user menu content to equal only 2 as not connected', () => {
        wrapper = lpiShallowMount(LpiHeader, defaultParams)

        expect(wrapper.vm.userMenu.length).toEqual(2)
    })

    it('should find the user menu content to equal only 6 as user is connected and is admin', () => {
        defaultParams.store.modules.users.getters.isConnected = () => true

        wrapper = lpiShallowMount(LpiHeader, defaultParams)

        expect(wrapper.vm.userMenu.length).toEqual(6)
    })

    it('should find the user menu content to equal only 4 as user is connected and is not admin', () => {
        defaultParams.store.modules.users.getters.isConnected = () => true
        defaultParams.store.modules.users.getters.getUserRoles = () => ['notadmin']

        wrapper = lpiShallowMount(LpiHeader, defaultParams)

        expect(wrapper.vm.userMenu.length).toEqual(4)
    })
})
