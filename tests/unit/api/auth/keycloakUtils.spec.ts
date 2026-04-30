// @vitest-environment happy-dom
import {
  createRandomString,
  getRefreshTokenInterval,
  cleanLocalStorage,
} from '~/api/auth/keycloakUtils'

import { afterAll, describe, expect, it, vi } from 'vitest'

describe('KeycloakUtils', () => {
  it('createRandomString', () => {
    expect(createRandomString(10).length).toBe(10)
  })

  it('getRefreshTokenInterval', () => {
    localStorage.setItem('REFRESH_TOKEN', '1642015614')
    localStorage.setItem('REFRESH_TOKEN_EXP', '1642015614')
    // give some seconds (in ms) of margin due to test execution time
    // use absolute value because time difference get negative after a while and inverse conditions
    expect(Math.abs(getRefreshTokenInterval())).toBeLessThanOrEqual(
      Math.abs(0.75 * (1642015614 * 1000 - Date.now())) + 10000
    )
    expect(Math.abs(getRefreshTokenInterval())).toBeGreaterThanOrEqual(
      Math.abs(0.75 * (1642015614 * 1000 - Date.now())) - 10000
    )
  })

  it('cleanLocalStorage | with existing values', () => {
    localStorage.setItem('REFRESH_TOKEN', 'dirty_value')
    localStorage.setItem('REFRESH_TOKEN_EXP', 'dirty_value')
    localStorage.setItem('SESSION_TOKEN', 'orginalValue')

    cleanLocalStorage()
    expect(localStorage.getItem('SESSION_TOKEN')).toBeNull()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })
})
