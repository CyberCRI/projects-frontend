import MockComponent from '~~/tests/helpers/MockComponent.vue'

import { afterEach, vi } from 'vitest'

vi.mock('vue3-popper', () => ({
  default: {
    name: 'Popper',
    template: '<div><slot /></div>',
  },
}))

// TODO remove mock for tiptaps
vi.mock('~/components/base/form/TextEditor/TipTapEditor.vue', () => ({
  default: MockComponent,
}))
vi.mock('~/components/base/form/TextEditor/TipTapCollaborativeEditor.vue', () => ({
  default: MockComponent,
}))

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
  `<Suspense> is an experimental feature and its API will likely change.`,
]
vi.spyOn(console, 'warn').mockImplementation((text: string) => {
  if (!IGNORED_WARN.includes(text)) {
    orginalWarn(text)
  }
})

afterEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})
