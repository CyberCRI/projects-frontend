import { PaginationsFactory } from '../tests/factories/paginations.factory'
import { initializeClientApi } from '../src/config/apis'
import { vi } from 'vitest'

// add global options and $fetch
initializeClientApi()

// hide userFollows (when changing in stores)
vi.mock('shared-projects-frontend/apis', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    // hide auto
    getUserFollows: vi.fn().mockResolvedValue(PaginationsFactory.generate()),
    getProjectCategoriesFollow: vi.fn().mockResolvedValue(PaginationsFactory.generate()),
    removeUserCookie: vi.fn().mockResolvedValue('removeUserCookie'),
  }
})
