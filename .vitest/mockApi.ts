import { initializeClientApi } from '~/config/apis'
import { vi } from 'vitest'

// add global options and $fetch
initializeClientApi()

vi.mock('@/api/auth/cookie.service', function () {
  return {
    removeApiCookie: vi.fn(async function () {
      return await Promise.resolve({})
    }),
  }
})
