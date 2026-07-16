import { usePatatoids } from '../src/composables/usePatatoids.ts'
import { onlyOnce, isNuxtReady } from './utils'
import { useNuxtApp } from 'nuxt/app'
import { beforeEach } from 'vitest'
import { vi } from 'vitest'

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn((obj) => obj?.name),
})

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
})

beforeEach(
  onlyOnce(async () => {
    if (isNuxtReady()) {
      const { registerEndpoint } = await import('@nuxt/test-utils/runtime')
      // mock result fetch blob for patatoid (no error during rendering in tests)
      usePatatoids().forEach((path) => {
        registerEndpoint(path, () => new Blob([]))
      })
    }
  })
)
