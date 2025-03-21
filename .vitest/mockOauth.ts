import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import * as oauth4webapi from '@panva/oauth4webapi'
vi.mock('@panva/oauth4webapi', async function (importOriginal) {
  const actual = (await importOriginal()) as Object
  return {
    ...actual,
    validateAuthResponse: vi.fn(),
    isOAuth2Error: vi.fn().mockReturnValue(false),
    generateKeyPair: vi.fn().mockReturnValue({ privateKey: '123', publicKey: '123' }),
    discoveryRequest: vi.fn().mockResolvedValue(true),
    processDiscoveryResponse: vi.fn().mockResolvedValue(true),
    generateRandomCodeVerifier: vi.fn().mockReturnValue('CodeVerifierString'),
    calculatePKCECodeChallenge: vi.fn().mockReturnValue('CodeChallengeString'),
    authorizationCodeGrantRequest: vi.fn().mockResolvedValue({}),
    parseWwwAuthenticateChallenges: vi.fn().mockReturnValue(null),
    getValidatedIdTokenClaims: vi.fn().mockResolvedValue({
      sub: 'keycloak_id_string',
      pid: 'people_id',
    }),
    userInfoRequest: vi.fn().mockResolvedValue({}),
    processAuthorizationCodeOpenIDResponse: vi.fn().mockResolvedValue({
      access_token: '123',
      refresh_token: '456',
      refresh_expires_in: 3600,
    }),

    processUserInfoResponse: vi.fn().mockResolvedValue({}),
  }
})
