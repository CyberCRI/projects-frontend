import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeAll, vi } from 'vitest'

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn((obj) => obj?.name),
})

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
})

vi.mock('~/composables/usePublic', () => ({
  usePublicURL: vi
    .fn()
    .mockImplementation(
      (url) => `${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX || ''}${url || ''}`
    ),
}))

beforeAll(() => {
  usePatatoids().forEach((path) => {
    registerEndpoint(path, () => new Blob([]))
  })
})
