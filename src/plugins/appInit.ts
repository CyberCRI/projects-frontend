import { defineNuxtPlugin } from '#imports'
import main from '@/main'

export default defineNuxtPlugin(async () => {
  // main make some unit (keycloak.spec) tests fail
  // so disable when in test mode
  // see https://github.com/nuxt/test-utils/issues/526
  if (import.meta?.env?.TEST !== 'true') {
    await main()
  }
})
