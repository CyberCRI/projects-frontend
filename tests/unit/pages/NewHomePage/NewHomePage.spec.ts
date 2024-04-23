import NewHomePage from '@/pages/NewHomePage/NewHomePage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { describe, expect, it } from 'vitest'
import flushPromises from 'flush-promises'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const store = {
    modules: {
        projectCategories: {
            namespaced: true,
            getters: {
                allOrderedByOrderId: vi.fn().mockReturnValue([]),
            },
        },
        organizations: {
            state: {
                current: { id: 'TEST', code: 'TEST' },
            },
            namespaced: true,
            getters: {
                current: vi.fn().mockReturnValue({ id: 'TEST', code: 'TEST' }),
            },
        },
        users: {
            namespaced: true,
            getters: {
                isLoggedIn: vi.fn().mockReturnValue(false),
            },
        },
    },
}

const connectedStore = {
    modules: {
        ...store.modules,
        users: {
            namespaced: true,
            getters: {
                id: vi.fn(),
                userFromApi: vi.fn(),
                getPermissions: vi.fn().mockReturnValue({}),
                isLoggedIn: vi.fn().mockReturnValue(true),
            },
            actions: {
                getUser: vi.fn(),
            },
        },
    },
}

const router = [{ name: 'Home', path: '/', component: NewHomePage }]

describe('NewHomePage', () => {
    it('should render NewHomePage', () => {
        let wrapper = lpiShallowMount(NewHomePage, { store, router, i18n })

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should contain site header as non connected user', () => {
        let wrapper = lpiShallowMount(NewHomePage, { store, router, i18n })
        // org header should be visible
        expect(wrapper.find('home-header-anonymous-stub').exists()).toBe(true)
        // user header should NOT be visible
        expect(wrapper.find('home-header-connected-stub').exists()).toBe(false)
        // categories dropdown visible
        expect(wrapper.find('project-categories-dropdown-stub').exists()).toBe(true)
        // search visible
        expect(wrapper.find('search-options-stub').exists()).toBe(true)
        // newsfeed visible
        expect(wrapper.find('home-newsfeed-stub').exists()).toBe(true)
        // recommendation block visible
        expect(wrapper.find('recommendation-block-stub').exists()).toBe(true)
        // home buttons NOT visible
        expect(wrapper.find('home-buttons-stub').exists()).toBe(false)
    })

    it('should contain user header as a connected user', async () => {
        let wrapper = lpiShallowMount(NewHomePage, { store: connectedStore, router, i18n })
        // TODO mock loadEvent and loadInstructions
        await flushPromises() // wait for data to be "loaded"
        // org header should not be visible
        expect(wrapper.find('home-header-anonymous-stub').exists()).toBe(false)
        // user header should be visible
        expect(wrapper.find('home-header-connected-stub').exists()).toBe(true)
        // search visible
        expect(wrapper.find('search-options-stub').exists()).toBe(true)
        // categories dropdown visible
        expect(wrapper.find('project-categories-dropdown-stub').exists()).toBe(true)
        // newsfeed visible
        expect(wrapper.find('home-newsfeed-stub').exists()).toBe(true)
        // recommendation block visible
        expect(wrapper.find('recommendation-block-stub').exists()).toBe(true)
        // home buttons visible
        expect(wrapper.find('home-buttons-stub').exists()).toBe(true)
    })
})
