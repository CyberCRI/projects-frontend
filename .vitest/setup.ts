// issue with router
// https://stackoverflow.com/questions/42535270/regeneratorruntime-is-not-defined-when-running-jest-test
import 'regenerator-runtime/runtime'
// workaround for @panva/oauth4webapi
// that needs a TextEncoder
// see https://github.com/inrupt/solid-client-authn-js/issues/1676
import { TextEncoder, TextDecoder } from 'util'
import { afterEach } from 'vitest'
import flushPromises from 'flush-promises'

// crypto is not in jsdom
// window.crypto =
Object.defineProperty(window, 'crypto', {
  value: require('@trust/webcrypto'),
})

// this ignore some warn when mounting compoennets (suspended from nuxt test)
const orginalWarn = console.warn
const IGNORED_WARN = [
  `[Vue warn]: App already provides property with key "Symbol(pinia)". It will be overwritten with the new value.`,
  `[Vue warn]: Component "i18n-t" has already been registered in target app.`,
  `[Vue warn]: Component "I18nT" has already been registered in target app.`,
  `[Vue warn]: Component "i18n-n" has already been registered in target app.`,
  `[Vue warn]: Component "I18nN" has already been registered in target app.`,
  `[Vue warn]: Component "i18n-d" has already been registered in target app.`,
  `[Vue warn]: Component "I18nD" has already been registered in target app.`,
  `[Vue warn]: Directive "t" has already been registered in target app.`,
]
vi.spyOn(console, 'warn').mockImplementation((text: string) => {
  if (!IGNORED_WARN.includes(text)) {
    orginalWarn(text)
  }
})

// setup-teardown-hook.js
import { afterAll, beforeAll } from 'vitest'
beforeAll(() => {
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder as any // "as any" fix weird unmatched types issue
})

afterEach(async () => {
  await flushPromises() // Wait for all pending promises to resolve
})
