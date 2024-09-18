import store from '@/store'
import * as keycloakUtils from '@/api/auth/keycloakUtils'
import keycloak from '@/api/auth/keycloak'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import pinia from '@/stores'
import useToasterStore from '@/stores/useToaster'
vi.mock('@/api/auth/keycloakUtils')

vi.spyOn(keycloakUtils, 'getRefreshTokenInterval').mockReturnValue(10)

vi.spyOn(keycloak, 'getCurrentUrl').mockImplementation(() => 'https://localhost:8080/dashboard')

vi.mock('@/router/index', () => ({
    default: {
        push: vi.fn(),
    },
}))
vi.mock('@/api/auth/keycloakUtils')

describe('Keycloak | codeVerifier', () => {
    it('generate', () => {
        const localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')

        keycloak.codeVerifier.generate()
        expect(localStorageSetItem).toHaveBeenCalledWith('CODE_VERIFIER', 'CodeVerifierString')
        localStorageSetItem.mockClear()
    })

    it('get', () => {
        const localStorageGetItem = vi.spyOn(Storage.prototype, 'getItem')

        keycloak.codeVerifier.get()
        expect(localStorageGetItem).toHaveBeenCalledWith('CODE_VERIFIER')
        localStorageGetItem.mockClear()
    })

    it('remove', () => {
        const localStorageRemoveItem = vi.spyOn(Storage.prototype, 'removeItem')

        keycloak.codeVerifier.remove()
        expect(localStorageRemoveItem).toHaveBeenCalledWith('CODE_VERIFIER')
        localStorageRemoveItem.mockClear()
    })
})

describe('Keycloak | codeChallenge', () => {
    it('get', async () => {
        Storage.prototype.getItem = vi.fn(() => '1234')

        const codeChallenge = await keycloak.codeChallenge.get()
        expect(codeChallenge).toEqual('CodeChallengeString')
    })
})

describe('Keycloak | appSecret', () => {
    it('generate', () => {
        const createRandomStringMock = keycloakUtils.createRandomString as Mock
        createRandomStringMock.mockReturnValue('randomString')
        const localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')

        keycloak.appSecret.generate()
        expect(localStorageSetItem).toHaveBeenCalledWith('APP_SECRET', 'randomString')
        localStorageSetItem.mockClear()
    })

    it('get', () => {
        const localStorageGetItem = vi.spyOn(Storage.prototype, 'getItem')

        keycloak.appSecret.get()
        expect(localStorageGetItem).toHaveBeenCalledWith('APP_SECRET')
        localStorageGetItem.mockClear()
    })

    it('remove', () => {
        const localStorageRemoveItem = vi.spyOn(Storage.prototype, 'removeItem')

        keycloak.appSecret.remove()
        expect(localStorageRemoveItem).toHaveBeenCalledWith('APP_SECRET')
        localStorageRemoveItem.mockClear()
    })
})

describe('Keycloak | refreshTokenLoop', () => {
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(
        vi.fn(() => {
            // dont trigger callback here as it will result in infinite loop
            // ;(cb as Function)()
            return 1
        }) as any // yes but wtf ?
    )
    vi.spyOn(globalThis, 'clearTimeout').mockImplementation(vi.fn())

    it('start', () => {
        store.dispatch = vi.fn().mockReturnValue({
            then: (cb) => cb(),
        })

        const localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')

        keycloak.refreshTokenLoop.start()
        expect(keycloak.refreshTokenLoop.loopId).toBe(1)
    })

    it('stop', () => {
        keycloak.refreshTokenLoop.stop()
        expect(clearTimeout).toHaveBeenCalledWith(1) // see setTimeout mock above
        expect(keycloak.refreshTokenLoop.loopId).toBeFalsy()
    })
})

describe('Keycloak | loginIfValidState', () => {
    beforeEach(() => {
        useToasterStore(pinia)
    })
    it('loginIfValidState', async () => {
        globalThis.window = Object.create(window)
        const search =
            '?state=%7B%22fromURL%22%3A%22http%3A%2F%2Flocalhost%3A8080%2Fdashboard%22%2C%22appSecret%22%3A%22jbag28ih70g882jgie94f9b8ig8i5hg8ha36g6713e5ab19fd5daai9cg1c96e11%22%7D&session_state=92768ca7-f045-41bd-989d-214729a20980&code=8852d144-8a51-430f-89c3-1774d4cf182c.92768ca7-f045-41bd-989d-214729a20980.69a45ad1-d2c0-4b43-8d61-a3688206d2f3'
        const searchParams = new URLSearchParams(search)

        store.dispatch = vi.fn().mockResolvedValue(true)
        vi.useFakeTimers()
        const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1577836800 * 1000)
        await keycloak.loginIfValidState(searchParams)
        expect(store.dispatch).toHaveBeenNthCalledWith(1, 'users/logIn', {
            access_token: '123',
            fromURL: 'http://localhost:8080/dashboard',
            parsedToken: { sub: 'keycloak_id_string', pid: 'people_id' }, // see .vitet/mockOauth.ts
            refresh_token: '456',
            refresh_token_exp: 1577836800 + 3600, // see .vitest/mockOauth.ts for 3600 (expires_in)
        })
        dateNowSpy.mockRestore()
    })
})
