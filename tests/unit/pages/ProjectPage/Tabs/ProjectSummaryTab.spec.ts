import { lpiShallowMount } from '../../../../helpers/LpiMount'
import ProjectSummaryTab from '@/pages/ProjectPage/Tabs/ProjectSummaryTab.vue'
import { ProjectOutputFactory } from '../../../../factories/project.factory'
import { CommentFactory } from '../../../../factories/comment.factory'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
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
        comments: {
            namespaced: true,
            getters: {
                all: vi.fn(() => CommentFactory.generate()),
            },
        },
        organizations: {
            namespaced: true,
            getters: {
                current: vi.fn(() => OrganizationOutputFactory.generate()),
            },
        },
        users: {
            namespaced: true,
            getters: {
                getUserGroups: vi.fn(() => []),
                getPermissions: vi.fn(() => []),
                isCOnnected: vi.fn(() => false),
            },
        },
    },
}

describe('Tab.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectSummaryTab, {
            propsData: {
                project: ProjectOutputFactory.generate(),
            },
            store,
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
