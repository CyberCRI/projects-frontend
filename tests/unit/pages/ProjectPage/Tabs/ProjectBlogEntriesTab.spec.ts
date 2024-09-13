import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectBlogEntriesTab from '@/pages/ProjectPage/Tabs/ProjectBlogEntriesTab.vue'
import utils from '@/functs/functions'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { ProjectOutputFactory } from '../../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import blog from '@/analytics/blog'

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
                project: () => ({
                    ...ProjectOutputFactory.generate(),
                    blog_entries: [],
                    slug: 'test',
                }),
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

describe('ProjectBlogEntriesTab.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectBlogEntriesTab, {
            store,
            i18n,
            provide: {
                projectLayoutToggleAddModal: vi.fn(),
            },
            props: {
                blogEntries: [],
                project: { id: 1 },
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
