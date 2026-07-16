import { usePatatoids } from '../src/composables/usePatatoids.ts'
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

let alreadyMocked = false
beforeEach(async () => {
  const isNuxtTestEnv = typeof $fetch !== 'undefined' || typeof useNuxtApp !== 'undefined'
  if (!isNuxtTestEnv || alreadyMocked) {
    return
  }

  // disable registerendpoint in non nuxt env (for keycloackUtils.spec.ts, it use happy-dom)
  try {
    useNuxtApp()
  } catch {
    return
  }

  const { registerEndpoint } = await import('@nuxt/test-utils/runtime')
  // mock result fetch blob for patatoid (no error during rendering in tests)
  usePatatoids().forEach((path) => {
    registerEndpoint(path, () => new Blob([]))
  })
  alreadyMocked = true
})
