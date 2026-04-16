import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import App from '@/app.vue'

import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import type { OrganizationOutput } from '@/models/organization.model'
import { flushPromises } from '@vue/test-utils'
import { Router } from 'vue-router'

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

describe('On tab focus', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: '123' } as OrganizationOutput
  })

  const localeMount = () => {
    const wrapper = lpiShallowMount(App, {
      stubs: { NuxtLink: true, NuxtPage: true },
    })

    return {
      wrapper,
      // @ts-expect-error ignore vm typing
      router: wrapper.vm.router as Router,
      // @ts-expect-error ignore vm typing
      usersStore: wrapper.vm.usersStore as useUsersStore,
    }
  }

  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('logout if token has expired', async () => {
    const { wrapper, router, usersStore } = localeMount()

    vi.spyOn(router, 'push')
    ;(checkExpiredToken as Mock).mockImplementation(() => true)

    // token in both
    usersStore.accessToken = 'access'
    localStorage.setItem('ACCESS_TOKEN', 'eyJhbGciOiJSUz')
    window.dispatchEvent(new Event('focus'))

    expect(checkExpiredToken).toHaveBeenCalled()
    expect(usersStore.resetUser).toHaveBeenCalled()

    await flushPromises()

    expect(router.push).toHaveBeenCalledWith({ name: 'Home' })

    wrapper.unmount()
  })

  it('logout if logged in but has no more user token', async () => {
    const { wrapper, router, usersStore } = localeMount()
    vi.spyOn(router, 'push')

    // token in store
    usersStore.accessToken = 'test1'
    localStorage.setItem('ACCESS_TOKEN', '')

    window.dispatchEvent(new Event('focus'))
    await flushPromises()

    expect(usersStore.resetUser).toHaveBeenCalled()

    expect(router.push).toHaveBeenCalledWith({ name: 'Home' })

    wrapper.unmount()
  })

  it('do not logout if not logged in', async () => {
    const { wrapper, router, usersStore } = localeMount()

    vi.spyOn(router, 'push')

    // not token in store and no in local storage
    usersStore.accessToken = null
    localStorage.setItem('ACCESS_TOKEN', '')

    window.dispatchEvent(new Event('focus'))
    await flushPromises()

    expect(usersStore.resetUser).not.toHaveBeenCalled()
    expect(router.push).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
