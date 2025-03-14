import { goToKeycloakLoginPage, logoutFromKeycloak } from '@/api/auth/auth.service'

import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import useKeycloak from '@/api/auth/keycloak'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
vi.mock('@/router/index', () => ({
  default: {
    push: vi.fn(),
  },
}))

vi.mock('@/api/auth/keycloak', () => {
  const kc = {
    getCurrentUrl: vi.fn().mockReturnValue('https://localhost:8080/dashboard'),
    appSecret: {
      generate: vi.fn().mockReturnValue(true),
      remove: vi.fn().mockReturnValue(true),
      get: vi.fn().mockReturnValue('123'),
    },
    codeVerifier: {
      generate: vi.fn().mockReturnValue(true),
      remove: vi.fn().mockReturnValue(true),
    },
    refreshTokenLoop: {
      stop: vi.fn().mockReturnValue(true),
    },
    codeChallenge: {
      get: vi.fn().mockResolvedValue('123'),
    },
    client: {
      get: vi.fn().mockReturnValue({ client_id: '123' }),
    },
  }
  return {
    default: () => kc,
  }
})

declare global {
  interface Window {
    happyDOM: any
  }
}

describe('auth.service', () => {
  // Do this to test code that uses .env
  const OLD_ENV = process.env
  let keycloak
  beforeEach(() => {
    vi.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
    window.happyDOM.setURL('https://localhost:3000')
    keycloak = useKeycloak()
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
