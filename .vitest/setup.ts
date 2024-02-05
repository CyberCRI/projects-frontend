// issue with router
// https://stackoverflow.com/questions/42535270/regeneratorruntime-is-not-defined-when-running-jest-test
import 'regenerator-runtime/runtime'
// workaround for @panva/oauth4webapi
// that needs a TextEncoder
// see https://github.com/inrupt/solid-client-authn-js/issues/1676
import { TextEncoder, TextDecoder } from 'util'
import { afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'

// crypto is not in jsdom
// window.crypto =
Object.defineProperty(window, 'crypto', {
    value: require('@trust/webcrypto'),
})

// setup-teardown-hook.js
import { afterAll, beforeAll } from 'vitest'
beforeAll(() => {
    global.TextEncoder = TextEncoder
    global.TextDecoder = TextDecoder as any // "as any" fix weird unmatched types issue
})
afterAll(() => {
    // delete global.TextEncoder
    // delete global.TextDecoder
})
afterEach(async () => {
    await flushPromises() // Wait for all pending promises to resolve
})
