import { goToKeycloakLoginPage, logoutFromKeycloak } from '@/api/auth/auth.service'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import keycloak from '@/api/auth/keycloak'
vi.spyOn(keycloak, 'getCurrentUrl').mockImplementation(() => 'https://localhost:8080/dashboard')

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
vi.mock('@/router/index', () => ({
    default: {
        push: vi.fn(),
    },
}))

vi.spyOn(keycloak.appSecret, 'generate').mockImplementation(() => true)
vi.spyOn(keycloak.appSecret, 'remove').mockImplementation(() => true)
vi.spyOn(keycloak.codeVerifier, 'generate').mockImplementation(() => true)
vi.spyOn(keycloak.codeVerifier, 'remove').mockImplementation(() => true)
vi.spyOn(keycloak.refreshTokenLoop, 'stop').mockImplementation(() => true)
vi.spyOn(keycloak.codeChallenge, 'get').mockResolvedValue('123')

declare global {
    interface Window {
        happyDOM: any
    }
}

describe('auth.service', () => {
    // Do this to test code that uses .env
    const OLD_ENV = process.env
    beforeEach(() => {
        vi.resetModules() // Most important - it clears the cache
        process.env = { ...OLD_ENV } // Make a copy
        window.happyDOM.setURL('https://localhost:3000')
    })
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { code: '123' } as unknown as OrganizationOutput
    })
    afterAll(() => {
        process.env = OLD_ENV // Restore old environment
    })

    it('goToKeycloakLoginPage', async () => {
        delete window.location
        window.location = {} as any
        const setHrefSpy = vi.fn()
        Object.defineProperty(window.location, 'href', {
            set: setHrefSpy,
        })

        await goToKeycloakLoginPage()

        expect(keycloak.codeVerifier.generate).toHaveBeenCalled()
        expect(keycloak.appSecret.generate).toHaveBeenCalled()
        expect(keycloak.codeChallenge.get).toHaveBeenCalled()
        expect(setHrefSpy).toHaveBeenCalled()
    })

    it('logoutFromKeycloak', () => {
        // Delete and recreate window.location setter to be able to spy its call
        delete window.location
        window.location = {} as any
        const setHrefSpy = vi.fn()
        Object.defineProperty(window.location, 'href', {
            set: setHrefSpy,
        })

        logoutFromKeycloak()
        expect(keycloak.codeVerifier.remove).toHaveBeenCalled()
        expect(keycloak.appSecret.remove).toHaveBeenCalled()
        expect(keycloak.refreshTokenLoop.stop).toHaveBeenCalled()
        expect(setHrefSpy).toHaveBeenCalled()
    })
})
