import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectBlogEntriesTab from '@/pages/ProjectPage/Tabs/ProjectBlogEntriesTab.vue'
import utils from '@/functs/functions'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { ProjectOutputFactory } from '../../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import blog from '@/analytics/blog'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'

vi.mock('@/functs/functions')
;(utils.hasPermission as Mock).mockImplementation(() => true)

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('ProjectBlogEntriesTab.vue', () => {
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        const projectsStore = useProjectsStore(pinia)
        projectsStore.project = {
            ...ProjectOutputFactory.generate(),
            files: [],
            links: [],
        }
    })
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectBlogEntriesTab, {
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
