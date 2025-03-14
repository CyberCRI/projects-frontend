import {
  createRandomString,
  getRefreshTokenInterval,
  cleanLocalStorage,
} from '@/api/auth/keycloakUtils'

import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const spiedLocalStorageRemoveItem = vi.spyOn(Storage.prototype, 'removeItem')

describe('KeycloakUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createRandomString', () => {
    expect(createRandomString(10).length).toBe(10)
  })

  it('getRefreshTokenInterval', () => {
    Storage.prototype.getItem = vi.fn(() => '1642015614')
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
    Storage.prototype.getItem = vi.fn(() => 'dirty_value')

    cleanLocalStorage()
    expect(spiedLocalStorageRemoveItem).toHaveBeenCalledWith('SESSION_TOKEN')
  })

  afterAll(() => {
    vi.resetAllMocks()
  })
})
