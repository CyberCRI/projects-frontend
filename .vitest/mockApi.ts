import { initializeClientApi } from '~/config/apis'
import { vi } from 'vitest'

// add global options and $fetch
initializeClientApi()

// hide userFollows (when changing in stores)
vi.mock('shared-projects-frontend/apis', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    getUserFollows: vi.fn().mockResolvedValue({ results: [] }),
  }
})

vi.mock('@/api/auth/cookie.service', function () {
  return {
    removeApiCookie: vi.fn(async function () {
      return await Promise.resolve({})
    }),
  }
})
