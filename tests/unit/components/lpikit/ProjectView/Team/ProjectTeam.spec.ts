import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectTeamTab from '@/pages/ProjectPage/Tabs/Team/ProjectTeamTab.vue'
import { ProjectOutputFactory } from '../../../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../../../factories/organization.factory'
import utils from '@/functs/functions'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/functs/functions')
;(utils.hasPermission as Mock).mockImplementation(() => true)

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
                project: () => ProjectOutputFactory.generate(),
                projectMembers: () => [],
            },
        },

        organizations: {
            namespaced: true,
            getters: {
                current: () => OrganizationOutputFactory.generate(),
            },
        },
    },
}

describe('ProjectTeamTab.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectTeamTab, {
            i18n,
            store,
            provide: {
                projectLayoutToggleAddModal: vi.fn(),
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
