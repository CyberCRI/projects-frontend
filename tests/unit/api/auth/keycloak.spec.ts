import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as authService from '~/api/auth/auth.service'

import useToasterStore from '~/stores/useToaster'
import useKeycloak from '~/api/auth/keycloak'
import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'
vi.mock('~/api/auth/keycloakUtils', () => ({
  getRefreshTokenInterval: vi.fn().mockReturnValue(10),
  getCurrentUrl: vi.fn().mockReturnValue('https://localhost:8080/dashboard'),
}))
vi.mock('~/api/auth/auth.serice')

beforeEach(() => {
  const originalLocation = window.location
  delete window.location
  // @ts-expect-error
  window.location = {
    ...originalLocation,
    href: 'https://localhost:8080/dashboard',
    pathname: 'https://localhost:8080/dashboard',
  }
})

const localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')
const localStorageGetItem = vi.spyOn(Storage.prototype, 'getItem')
const localStorageRemoveItem = vi.spyOn(Storage.prototype, 'removeItem')

describe.skip('Keycloak | codeChallenge', () => {
  afterEach(() => {
    localStorage.clear()
    localStorageSetItem.mockClear()
    localStorageGetItem.mockClear()
    localStorageRemoveItem.mockClear()
  })
  it('get', async () => {
    localStorageGetItem.mockReturnValue('1234')
    const keycloak = useKeycloak()

    const codeChallenge = await keycloak.codeChallenge.get()
    expect(codeChallenge).toEqual('CodeChallengeString')
  })
})

describe.skip('Keycloak | loginIfValidState', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    useToasterStore(pinia)
  })
  it('loginIfValidState', async () => {
    globalThis.window = Object.create(window)
    const keycloak = useKeycloak()

    const search =
      '?state=%7B%22fromURL%22%3A%22http%3A%2F%2Flocalhost%3A8080%2Fdashboard%22%2C%22appSecret%22%3A%22jbag28ih70g882jgie94f9b8ig8i5hg8ha36g6713e5ab19fd5daai9cg1c96e11%22%7D&session_state=92768ca7-f045-41bd-989d-214729a20980&code=8852d144-8a51-430f-89c3-1774d4cf182c.92768ca7-f045-41bd-989d-214729a20980.69a45ad1-d2c0-4b43-8d61-a3688206d2f3'
    const searchParams = new URLSearchParams(search)

    vi.useRealTimers()
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1577836800 * 1000)
    vi.spyOn(usersStore, 'logIn')
    vi.spyOn(keycloak.codeVerifier, 'get').mockReturnValue('123')

    await keycloak.loginIfValidState(searchParams)
    expect(usersStore.logIn).toHaveBeenNthCalledWith(1, {
      access_token: '123',
      expires_in: NaN,
      id_token: undefined,
      parsedToken: { sub: 'keycloak_id_string', pid: 'people_id' }, // see .vitet/mockOauth.ts
      refresh_token: '456',
      refresh_token_exp: 1577836800 + 3600, // see .vitest/mockOauth.ts for 3600 (expires_in)
    })
    dateNowSpy.mockRestore()
  })

  it('relog if no code verifier', async () => {
    globalThis.window = Object.create(window)
    const keycloak = useKeycloak()

    localStorageGetItem.mockReturnValue('123456') // codeVerifier
    const search =
      '?state=%7B%22fromURL%22%3A%22http%3A%2F%2Flocalhost%3A8080%2Fdashboard%22%2C%22appSecret%22%3A%22jbag28ih70g882jgie94f9b8ig8i5hg8ha36g6713e5ab19fd5daai9cg1c96e11%22%7D&session_state=92768ca7-f045-41bd-989d-214729a20980&code=8852d144-8a51-430f-89c3-1774d4cf182c.92768ca7-f045-41bd-989d-214729a20980.69a45ad1-d2c0-4b43-8d61-a3688206d2f3'
    const searchParams = new URLSearchParams(search)

    vi.useRealTimers()
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1577836800 * 1000)
    vi.spyOn(usersStore, 'logIn')

    vi.spyOn(keycloak.codeVerifier, 'get').mockReturnValue('')

    vi.spyOn(authService, 'goToKeycloakLoginPage')

    await keycloak.loginIfValidState(searchParams)
    expect(authService.goToKeycloakLoginPage).toHaveBeenCalled()
    dateNowSpy.mockRestore()
  })
})
