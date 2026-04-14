import { lpiShallowMountExtra } from '@/../tests/helpers/LpiMount'
import App from '@/app.vue'

import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import type { OrganizationOutput } from '@/models/organization.model'

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

const localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')
const localStorageGetItem = vi.spyOn(Storage.prototype, 'getItem')
const localStorageRemoveItem = vi.spyOn(Storage.prototype, 'removeItem')

describe('On tab focus', () => {
  let usersStore
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: '123' } as OrganizationOutput
    usersStore = useUsersStore(pinia)
  })

  Object.defineProperty(window, 'socket', { value: { connected: false }, configurable: true })

  function _mount() {
    return lpiShallowMountExtra(App, {
      stubs: { NuxtLink: true, NuxtPage: true },
    })
  }

  afterEach(() => {
    afterEach(() => {
      localStorage.clear()
      localStorageSetItem.mockClear()
      localStorageGetItem.mockClear()
      localStorageRemoveItem.mockClear()
    })
    vi.clearAllMocks()
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
