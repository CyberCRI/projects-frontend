import * as keycloakUtils from '@/api/auth/keycloakUtils'
import useKeycloak from '@/api/auth/keycloak'
import * as authService from '@/api/auth/auth.service'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'
import { flushPromises } from '@vue/test-utils'

vi.mock('@/api/auth/keycloakUtils')
let keycloak = useKeycloak()

vi.mock('@/api/auth/auth.serice')

vi.spyOn(keycloakUtils, 'getRefreshTokenInterval').mockReturnValue(10)

vi.spyOn(keycloak, 'getCurrentUrl').mockImplementation(() => 'https://localhost:8080/dashboard')

const localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')
const localStorageGetItem = vi.spyOn(Storage.prototype, 'getItem')
const localStorageRemoveItem = vi.spyOn(Storage.prototype, 'removeItem')

describe('Keycloak | codeChallenge', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
  })
  afterEach(() => {
    localStorage.clear()
    localStorageSetItem.mockClear()
    localStorageGetItem.mockClear()
    localStorageRemoveItem.mockClear()
  })
  it('get', async () => {
    localStorageGetItem.mockReturnValue('1234')

    const codeChallenge = await keycloak.codeChallenge.get()
    expect(codeChallenge).toEqual('CodeChallengeString')
  })
})
describe('Keycloak | loginIfValidState', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    useToasterStore(pinia)
  })
  afterEach(() => {
    usersStore.$reset()
  })
  it('loginIfValidState', async () => {
    globalThis.window = Object.create(window)

    const search =
      '?state=%7B%22fromURL%22%3A%22http%3A%2F%2Flocalhost%3A8080%2Fdashboard%22%2C%22appSecret%22%3A%22jbag28ih70g882jgie94f9b8ig8i5hg8ha36g6713e5ab19fd5daai9cg1c96e11%22%7D&session_state=92768ca7-f045-41bd-989d-214729a20980&code=8852d144-8a51-430f-89c3-1774d4cf182c.92768ca7-f045-41bd-989d-214729a20980.69a45ad1-d2c0-4b43-8d61-a3688206d2f3'
    const searchParams = new URLSearchParams(search)

    vi.useFakeTimers()
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1577836800 * 1000)
    vi.spyOn(usersStore, 'logIn')

    vi.spyOn(keycloak.codeVerifier, 'get').mockReturnValue('123')

    await keycloak.loginIfValidState(searchParams)
    expect(usersStore.logIn).toHaveBeenNthCalledWith(1, {
      access_token: '123',
      fromURL: 'http://localhost:8080/dashboard',
      parsedToken: { sub: 'keycloak_id_string', pid: 'people_id' }, // see .vitet/mockOauth.ts
      refresh_token: '456',
      refresh_token_exp: 1577836800 + 3600, // see .vitest/mockOauth.ts for 3600 (expires_in)
    })
    dateNowSpy.mockRestore()
  })

  it('relog if no code verifier', async () => {
    globalThis.window = Object.create(window)

    localStorageGetItem.mockReturnValue('123456') // codeVerifier
    const search =
      '?state=%7B%22fromURL%22%3A%22http%3A%2F%2Flocalhost%3A8080%2Fdashboard%22%2C%22appSecret%22%3A%22jbag28ih70g882jgie94f9b8ig8i5hg8ha36g6713e5ab19fd5daai9cg1c96e11%22%7D&session_state=92768ca7-f045-41bd-989d-214729a20980&code=8852d144-8a51-430f-89c3-1774d4cf182c.92768ca7-f045-41bd-989d-214729a20980.69a45ad1-d2c0-4b43-8d61-a3688206d2f3'
    const searchParams = new URLSearchParams(search)

    vi.useFakeTimers()
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1577836800 * 1000)
    vi.spyOn(usersStore, 'logIn')

    vi.spyOn(keycloak.codeVerifier, 'get').mockReturnValue('')

    vi.spyOn(authService, 'goToKeycloakLoginPage')

    await keycloak.loginIfValidState(searchParams)
    expect(authService.goToKeycloakLoginPage).toHaveBeenCalled()
    dateNowSpy.mockRestore()
  })
})
