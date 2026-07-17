import { vi } from 'vitest'

// default mock for nuxt utilities

export const mockUseRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  beforeEach: vi.fn(),
  beforeResolve: vi.fn(),
  afterEach: vi.fn(),
  onError: vi.fn(),
  hasRoute: vi.fn(),
})

export const mockUseRoute = (def: object = {}) => ({
  path: '',
  matches: [],
  ...(def || {}),
})
