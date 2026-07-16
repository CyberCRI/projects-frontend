import { PaginationsFactory } from '../tests/factories/paginations.factory'
import { initializeClientApi } from '../src/config/apis'
import createFetchMock from 'vitest-fetch-mock'
import { onlyOnce, isNuxtReady } from './utils'
import { vi } from 'vitest'

beforeEach(
  onlyOnce(() => {
    if (isNuxtReady()) {
      initializeClientApi()
      return true
    }
  })
)

// add global options and $fetch

// hide userFollows (when changing in stores)
vi.mock('shared-projects-frontend/apis', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    // hide auto
    getUserFollows: vi.fn().mockImplementation(() => PaginationsFactory.generate()),
    getProjectCategoriesFollow: vi.fn().mockImplementation(() => PaginationsFactory.generate()),
    removeUserCookie: vi.fn().mockResolvedValue('removeUserCookie'),
  }
})

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()
