import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectDescriptionTab from '@/pages/ProjectPage/Tabs/ProjectDescriptionTab.vue'
import { ProjectFactory } from '../../../../../factories/project.factory'
import { UserFactory } from '../../../../../factories/user.factory'
import permissions from '@/mixins/permissions'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/mixins/permissions')
;(permissions.computed.canEditProject as Mock).mockImplementation(() => true)

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

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    description: '<h1>Origine du projet</h1>',
                }),
            },
        },
        users: {
            namespaced: true,
            state: {
                user: UserFactory.generate(),
            },
        },
    },
}

describe('ProjectDescriptionTab.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectDescriptionTab, {
            props: {
                project: ProjectFactory.generate(),
            },
            store,
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
