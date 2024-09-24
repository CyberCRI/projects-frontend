import { lpiShallowMount } from '../../../../helpers/LpiMount'
import ProjectSummaryTab from '@/pages/ProjectPage/Tabs/ProjectSummaryTab.vue'
import { ProjectOutputFactory } from '../../../../factories/project.factory'
import { CommentFactory } from '../../../../factories/comment.factory'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
import projectAnalytic from '@/analytics/project.analytic'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
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
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
    })
    it('should render component', () => {
        const project = ProjectOutputFactory.generate()
        const wrapper = lpiShallowMount(ProjectSummaryTab, {
            props: {
                project,
                comments: [CommentFactory.generate()],
                team: project.team,
            },
            store,
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
