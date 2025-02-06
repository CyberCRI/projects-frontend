import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import DescriptionDrawer from '@/components/project/description/DescriptionDrawer.vue'
import { describe, expect, it } from 'vitest'
import { ProjectFactory, ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { loadLocaleMessages } from '@/../i18n.config'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

describe('DescriptionDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const projectsStore = useProjectsStore(pinia)

        projectsStore.project = {
            ...ProjectOutputFactory.generate(),
            files: [],
            links: [],
        }
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        defaultParams = {
            i18n,
            props: {
                project: {
                    ...ProjectFactory.generate(),
                    organizations: [OrganizationOutputFactory.generate()],
                },
                isOpened: true,
            },
            provide: {
                projectLayoutProjectPatched: vi.fn(),
            },
        }
    })

    it('should render DescriptionDrawer component', () => {
        wrapper = lpiShallowMount(DescriptionDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
