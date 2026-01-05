import { DEFAULT_PATATOID } from '@/composables/usePatatoids.ts'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

// mock result fetch blob for patatoid (no error during rendering in tests)
DEFAULT_PATATOID.forEach((path) => {
  registerEndpoint(path, () => [])
})
