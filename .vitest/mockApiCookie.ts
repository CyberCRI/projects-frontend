import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { initializeClientApi } from '~/config/apis'

// add global options and $fetch
initializeClientApi()

// ignore remove-cookie
registerEndpoint('/user/remove-authentication-cookie', () => {
  return 'Cookie deleted'
})
