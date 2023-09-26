import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectBlogEntries from '@/components/lpikit/ProjectView/BlogEntries/ProjectBlogEntries.vue'
import utils from '@/functs/functions'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { ProjectOutputFactory } from '../../../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../../../factories/organization.factory'

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

describe('ProjectBlogEntries.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectBlogEntries, {
            store,
            i18n,
            provide: {
                projectLayoutToggleAddModal: vi.fn(),
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
