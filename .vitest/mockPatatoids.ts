import { DEFAULT_PATATOID } from '../src/composables/usePatatoids.ts'
import { beforeAll } from 'vitest'

beforeAll(async () => {
  const isNuxtTestEnv = typeof $fetch !== 'undefined' || typeof useNuxtApp !== 'undefined'
  // disable registerendpoint in non nuxt env (for keycloackUtils.spec.ts, it use happy-dom)
  if (isNuxtTestEnv) {
    const { registerEndpoint } = await import('@nuxt/test-utils/runtime')
    // mock result fetch blob for patatoid (no error during rendering in tests)
    DEFAULT_PATATOID.forEach((path) => {
      registerEndpoint(path, () => [])
    })
  }
})
