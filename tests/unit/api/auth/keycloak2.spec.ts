import * as keycloakUtils from '@/api/auth/keycloakUtils'
import useKeycloak from '@/api/auth/keycloak'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'
import { flushPromises } from '@vue/test-utils'

vi.mock('@/api/auth/keycloakUtils')
let keycloak = useKeycloak()

vi.spyOn(keycloakUtils, 'getRefreshTokenInterval').mockReturnValue(10)

vi.spyOn(keycloak, 'getCurrentUrl').mockImplementation(() => 'https://localhost:8080/dashboard')

const localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')
const localStorageGetItem = vi.spyOn(Storage.prototype, 'getItem')
const localStorageRemoveItem = vi.spyOn(Storage.prototype, 'removeItem')

describe.skip('Keycloak | codeVerifier', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
  })
  afterEach(() => {
    localStorage.clear()
    localStorageSetItem.mockClear()
    localStorageGetItem.mockClear()
    localStorageRemoveItem.mockClear()
  })
  it('generate', () => {
    keycloak.codeVerifier.generate()
    expect(localStorageSetItem).toHaveBeenCalledWith('CODE_VERIFIER', 'CodeVerifierString')
  })

  it('get', () => {
    keycloak.codeVerifier.get()
    expect(localStorageGetItem).toHaveBeenCalledWith('CODE_VERIFIER')
  })

  it('remove', () => {
    keycloak.codeVerifier.remove()
    expect(localStorageRemoveItem).toHaveBeenCalledWith('CODE_VERIFIER')
  })
})

describe.skip('Keycloak | appSecret', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
  })

  afterEach(() => {
    localStorage.clear()
    localStorageSetItem.mockClear()
    localStorageGetItem.mockClear()
    localStorageRemoveItem.mockClear()
  })
  it('generate', () => {
    const createRandomStringMock = keycloakUtils.createRandomString as Mock
    createRandomStringMock.mockReturnValue('randomString')
    keycloak.appSecret.generate()
    expect(localStorageSetItem).toHaveBeenCalledWith('APP_SECRET', 'randomString')
  })

  it('get', () => {
    keycloak.appSecret.get()
    expect(localStorageGetItem).toHaveBeenCalledWith('APP_SECRET')
  })

  it('remove', () => {
    keycloak.appSecret.remove()
    expect(localStorageRemoveItem).toHaveBeenCalledWith('APP_SECRET')
  })
})

describe.skip('Keycloak | refreshTokenLoop', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
  })
  afterEach(() => {
    usersStore.$reset()
  })
  vi.spyOn(globalThis, 'setTimeout').mockImplementation(
    vi.fn(() => {
      // dont trigger callback here as it will result in infinite loop
      // ;(cb as Function)()
      return 1
    }) as any // yes but wtf ?
  )
  vi.spyOn(globalThis, 'clearTimeout').mockImplementation(vi.fn())

  it('start', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('123')

    usersStore.refreshToken = '123'
    usersStore.doRefreshToken = vi.fn(() => Promise.resolve('123'))
    keycloak.refreshTokenLoop.start()
    await flushPromises()
    expect(keycloak.refreshTokenLoop.loopId).toBe(1)
  })

  it('stop', () => {
    keycloak.refreshTokenLoop.stop()
    expect(clearTimeout).toHaveBeenCalledWith(1) // see setTimeout mock above
    expect(keycloak.refreshTokenLoop.loopId).toBeFalsy()
  })
})
