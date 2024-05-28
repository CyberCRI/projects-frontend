import { lpiShallowMountExtra } from '../../helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import App from '@/App.vue'

import MockComponent from '../../helpers/MockComponent.vue'
import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'

vi.mock('y-prosemirror', () => ({
    default: {},
}))

vi.mock('../../../src/api/auth/keycloakUtils', () => {
    return {
        checkExpiredToken: vi.fn(),
    }
})

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

function mockLocalStorage() {
    let store = {}
    return {
        getItem: function (key) {
            return store[key]
        },
        setItem: function (key, value) {
            store[key] = value
        },
        clear: function () {
            store = {}
        },
        removeItem: function (key) {
            delete store[key]
        },
    }
}

function buildStore(isLogged, resetUser) {
    const mutations = {
        RESET_USER: resetUser,
    }

    return {
        modules: {
            users: {
                namespaced: true,
                state: () => ({ all: [] }),
                getters: {
                    isLoggedIn: () => isLogged,
                },
                actions: {},
                mutations: mutations,
            },
            organizations: {
                namespaced: true,
                state: () => ({ all: [] }),
                getters: {
                    theme: () => 'main',
                    current: () => {
                        return { code: '123' }
                    },
                },
                actions: {},
                mutations: {},
            },
            app: {
                namespaced: true,
                state: () => ({ loading: { visible: true, message: null } }),
                getters: {
                    loading: vi.fn(() => {
                        return { visible: true, message: null }
                    }),
                },
                actions: {
                    updateLoading: vi.fn(),
                },
                mutations: {},
            },
            notifications: {
                namespaced: true,
                state: () => ({
                    toastList: [
                        {
                            message: '',
                            isOpened: false,
                            type: '',
                        },
                    ],
                }),
                getters: {
                    getToastList: vi.fn(() => [
                        {
                            message: '',
                            isOpened: false,
                            type: '',
                        },
                    ]),
                },
                actions: {
                    deleteToast: vi.fn(),
                },
            },
            faqs: {
                namespaced: true,
                actions: {
                    getFaq: vi.fn(),
                },
            },
        },
    }
}

describe('On tab focus', () => {
    const localStorageMock = mockLocalStorage()

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        configurable: true,
        writable: true,
    })
    Object.defineProperty(window, 'socket', { value: { connected: false }, configurable: true })

    const $t = (v) => v

    function _mount(store) {
        return lpiShallowMountExtra(App, {
            store,
            i18n,
            props: {},
            router: [
                {
                    path: '/',
                    component: MockComponent,
                    name: 'Home',
                },
                { path: '/blank', component: MockComponent, name: 'blank' },
            ],
            stubs: { 'router-link': true, RouterView: true },
        })
    }

    afterEach(() => {
        vi.clearAllMocks()
    })

    test('logout if token has expired', () => {
        const resetUser = vi.fn(() => true)
        const store = buildStore(true, resetUser)

        const { wrapper, router } = _mount(store)
        vi.spyOn(router, 'push')
        ;(checkExpiredToken as Mock).mockImplementation(() => true)

        window.localStorage.setItem('ACCESS_TOKEN', 'eyJhbGciOiJSUz')
        window.dispatchEvent(new Event('focus'))

        expect(checkExpiredToken).toHaveBeenCalled()
        expect(resetUser).toHaveBeenCalled()

        expect(router.push).toHaveBeenCalledWith({ name: 'Home' })

        wrapper.unmount()
    })

    test('logout if logged in but has no more user token', () => {
        const resetUser = vi.fn(() => true)
        const store = buildStore(true, resetUser)

        const { wrapper, router } = _mount(store)
        vi.spyOn(router, 'push')

        window.localStorage.setItem('ACCESS_TOKEN', null)

        window.dispatchEvent(new Event('focus'))

        expect(resetUser).toHaveBeenCalled()

        expect(router.push).toHaveBeenCalledWith({ name: 'Home' })

        wrapper.unmount()
    })

    test('do not logout if not logged in', () => {
        const resetUser = vi.fn(() => true)
        const store = buildStore(false, resetUser)

        const { wrapper, router } = _mount(store)
        vi.spyOn(router, 'push')

        window.localStorage.setItem('ACCESS_TOKEN', null)

        window.dispatchEvent(new Event('focus'))

        expect(resetUser).not.toHaveBeenCalled()

        expect(router.push).not.toHaveBeenCalled()

        wrapper.unmount()
    })
})
