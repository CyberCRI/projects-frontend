import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectResourcesTab from '@/pages/ProjectPage/Tabs/ProjectResourcesTab.vue'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import utils from '@/functs/functions'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
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

describe('ProjectResourcesTab.vue', () => {
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
        const wrapper = lpiShallowMount(ProjectResourcesTab, {
            i18n,
            provide: {
                projectLayoutToggleAddModal: vi.fn(),
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
