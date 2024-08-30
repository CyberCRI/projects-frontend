import { lpiShallowMount } from '../../../../helpers/LpiMount'
import ProjectCommentsTab from '@/pages/ProjectPage/Tabs/ProjectCommentsTab.vue'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
vi.mock('y-prosemirror', () => ({ default: {} }))

const store = {
    modules: {
        comments: {
            namespaced: true,
            getters: {
                all: () => [],
            },
        },
    },
}

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
        defaultParams = { i18n, store, provide: { projectLayoutToggleAddModal: vi.fn() } }
    })

    it('should render ProjectComments component', () => {
        wrapper = lpiShallowMount(ProjectCommentsTab, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
