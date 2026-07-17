import MockComponent from '~~/tests/helpers/MockComponent.vue'

import { afterEach, vi } from 'vitest'

process.on('unhandledRejection', (e) => {
  console.error(e)
})

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

afterEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})
