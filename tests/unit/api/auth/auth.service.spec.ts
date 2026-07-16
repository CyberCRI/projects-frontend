import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import type { OrganizationOutput } from 'shared-projects-frontend/models'
import useOrganizationsStore from '~/stores/useOrganizations'
import pinia from '~/stores'

const mockUseKeycloack = {
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
vi.mock('~/api/auth/keycloak', () => {
  return {
    default: () => mockUseKeycloack,
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
  beforeEach(() => {
    vi.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
    window.happyDOM.setURL('https://localhost:3000')
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: '123' } as unknown as OrganizationOutput
  })
  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  it('goToKeycloakLoginPage', async () => {
    delete window.location
    window.location = {
      pathname: '',
    } as any
    const setHrefSpy = vi.fn()
    Object.defineProperty(window.location, 'href', {
      set: setHrefSpy,
    })

    const { goToKeycloakLoginPage } = await import('~/api/auth/auth.service')
    await goToKeycloakLoginPage()

    expect(mockUseKeycloack.codeVerifier.generate).toHaveBeenCalled()
    expect(mockUseKeycloack.appSecret.generate).toHaveBeenCalled()
    expect(mockUseKeycloack.codeChallenge.get).toHaveBeenCalled()
    expect(setHrefSpy).toHaveBeenCalled()
  })

  it('logoutFromKeycloak', async () => {
    // Delete and recreate window.location setter to be able to spy its call
    delete window.location
    window.location = {} as any
    const setHrefSpy = vi.fn()
    Object.defineProperty(window.location, 'href', {
      set: setHrefSpy,
    })

    const { logoutFromKeycloak } = await import('~/api/auth/auth.service')

    logoutFromKeycloak()
    expect(mockUseKeycloack.codeVerifier.remove).toHaveBeenCalled()
    expect(mockUseKeycloack.appSecret.remove).toHaveBeenCalled()
    expect(mockUseKeycloack.refreshTokenLoop.stop).toHaveBeenCalled()
    expect(setHrefSpy).toHaveBeenCalled()
  })
})
