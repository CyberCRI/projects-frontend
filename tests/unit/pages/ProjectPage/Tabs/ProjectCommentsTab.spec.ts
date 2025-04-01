import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import ProjectCommentsTab from '@/pages/ProjectPage/Tabs/ProjectCommentsTab.vue'
import english from '@/i18n/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
vi.mock('y-prosemirror', () => ({ default: {} }))

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('ProjectCommentsTab', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: { project: { id: 1 }, comments: [] },
      i18n,
      provide: { projectLayoutToggleAddModal: vi.fn() },
    }
  })

  it('should render ProjectComments component', () => {
    wrapper = lpiShallowMount(ProjectCommentsTab, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
