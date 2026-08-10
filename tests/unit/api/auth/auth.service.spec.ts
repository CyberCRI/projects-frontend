import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

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
    default: vi.fn().mockImplementation(() => mockUseKeycloack),
  }
})

declare global {
  interface Window {
    happyDOM: any
  }
}

describe('auth.service', () => {
  // Do this to test code that uses .env
  beforeAll(() => {
    window.happyDOM.setURL('https://localhost:3000')
  })

  beforeEach(() => {
    vi.resetModules()
  })

  it('goToKeycloakLoginPage', async () => {
    const oldHref = window.location.href
    const { goToKeycloakLoginPage } = await import('~/api/auth/auth.service')

    await goToKeycloakLoginPage()

    expect(mockUseKeycloack.codeVerifier.generate).toHaveBeenCalled()
    expect(mockUseKeycloack.appSecret.generate).toHaveBeenCalled()
    expect(mockUseKeycloack.codeChallenge.get).toHaveBeenCalled()
    // href are changed
    expect(window.location.href).not.toBe(oldHref)
    expect(window.location.href).toBeTruthy()
  })

  it('logoutFromKeycloak', async () => {
    const oldHref = window.location.href
    const { logoutFromKeycloak } = await import('~/api/auth/auth.service')

    await logoutFromKeycloak()
    expect(mockUseKeycloack.codeVerifier.remove).toHaveBeenCalled()
    expect(mockUseKeycloack.appSecret.remove).toHaveBeenCalled()
    expect(mockUseKeycloack.refreshTokenLoop.stop).toHaveBeenCalled()
    // href are changed
    expect(window.location.href).not.toBe(oldHref)
    expect(window.location.href).toBeTruthy()
  })
})
