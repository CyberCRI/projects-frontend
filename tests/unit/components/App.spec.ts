import { lpiShallowMountExtra } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import App from '@/App.vue'

import MockComponent from '@/../tests/helpers/MockComponent.vue'
import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import type { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { refreshAccessToken } from '@/api/auth/auth.service'

vi.mock('y-prosemirror', () => ({
    default: {},
}))

vi.mock('@/api/auth/keycloakUtils', () => {
    return {
        checkExpiredToken: vi.fn(),
        cleanLocalStorage: vi.fn(),
        getRefreshTokenInterval: vi.fn().mockReturnValue(1),
    }
})

vi.mock('@/api/auth/auth.service', () => {
    return {
        refreshAccessToken: vi.fn(() =>
            Promise.resolve({
                access_token: 'access',
                refresh_token: 'refresh',
                refresh_token_exp: 1,
                parsedToken: {},
                fromURL: 'url',
                id_token: 'id',
            })
        ),
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

describe('On tab focus', () => {
    let usersStore
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { code: '123' } as OrganizationOutput
        usersStore = useUsersStore(pinia)
    })
    const localStorageMock = mockLocalStorage()

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        configurable: true,
        writable: true,
    })
    Object.defineProperty(window, 'socket', { value: { connected: false }, configurable: true })

    const $t = (v) => v

    function _mount() {
        return lpiShallowMountExtra(App, {
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
            stubs: { NuxtLink: true, NuxtPage: true },
        })
    }

    afterEach(() => {
        vi.clearAllMocks()
        usersStore.$reset()
    })

    test('logout if token has expired', () => {
        usersStore.accessToken = 'acces_token' // pretend user is logged in

        const { wrapper, router } = _mount()
        vi.spyOn(router, 'push')
        ;(checkExpiredToken as Mock).mockImplementation(() => true)

        window.localStorage.setItem('ACCESS_TOKEN', 'eyJhbGciOiJSUz')
        window.dispatchEvent(new Event('focus'))

        expect(checkExpiredToken).toHaveBeenCalled()
        expect(usersStore.resetUser).toHaveBeenCalled()

        expect(router.push).toHaveBeenCalledWith({ name: 'Home' })

        wrapper.unmount()
    })

    test('logout if logged in but has no more user token', () => {
        const { wrapper, router } = _mount()
        vi.spyOn(router, 'push')

        usersStore.accessToken = 'acces_token' // pretend user is logged in

        window.localStorage.setItem('ACCESS_TOKEN', null)

        window.dispatchEvent(new Event('focus'))

        expect(usersStore.resetUser).toHaveBeenCalled()

        expect(router.push).toHaveBeenCalledWith({ name: 'Home' })

        wrapper.unmount()
    })

    test('do not logout if not logged in', () => {
        const { wrapper, router } = _mount()
        vi.spyOn(router, 'push')

        window.localStorage.setItem('ACCESS_TOKEN', null)

        window.dispatchEvent(new Event('focus'))

        expect(usersStore.resetUser).not.toHaveBeenCalled()

        expect(router.push).not.toHaveBeenCalled()

        wrapper.unmount()
    })
})
