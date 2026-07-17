import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'
import type { Router } from 'vue-router'

const checkExpiredToken = vi.fn()
const cleanLocalStorage = vi.fn()
const getRefreshTokenInterval = vi.fn().mockReturnValue(1)

vi.mock('~/api/auth/keycloakUtils', () => {
  return {
    checkExpiredToken,
    cleanLocalStorage,
    getRefreshTokenInterval,
  }
})

vi.mock('~/api/auth/auth.service', async (origi) => {
  return {
    ...(await origi()),
    refreshAccessToken: vi.fn().mockImplementation(() => ({
      access_token: 'access',
      refresh_token: 'refresh',
      refresh_token_exp: 1,
      parsedToken: {},
      fromURL: 'url',
      id_token: 'id',
    })),
  }
})

describe('On tab focus', () => {
  beforeAll(() => {
    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = OrganizationFactory.generate()
  })

  beforeEach(() => {
    vi.resetModules()
  })

  const localeMount = async () => {
    const App = (await import('~/app.vue')).default

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
  })

  it('logout if token has expired', async () => {
    const { wrapper, router, usersStore } = await localeMount()

    vi.spyOn(usersStore, 'resetUser')
    vi.spyOn(router, 'push')
    checkExpiredToken.mockImplementation(() => true)

    // // token in both
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
    const { wrapper, router, usersStore } = await localeMount()
    vi.spyOn(usersStore, 'resetUser')
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
    const { wrapper, router, usersStore } = await localeMount()
    vi.spyOn(usersStore, 'resetUser')
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
