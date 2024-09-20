import { lpiShallowMount } from '../../../../helpers/LpiMount'
import DescriptionDrawer from '@/components/project/description/DescriptionDrawer.vue'
import { describe, expect, it } from 'vitest'
import { ProjectFactory, ProjectOutputFactory } from '../../../../factories/project.factory'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import { loadLocaleMessages } from '@/locales/i18n'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const project = ProjectOutputFactory.generate()

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    ...ProjectOutputFactory.generate(),
                    files: [],
                    links: [],
                }),
                currentProjectSlug: vi.fn(() => project.slug),
                currentProjectId: vi.fn(() => project.id),
            },
            actions: {
                updateProject: vi.fn(),
            },
        },
        organizations: {
            namespaced: true,
            getters: {
                current: () => OrganizationOutputFactory.generate(),
            },
        },
        users: {
            namespaced: true,
            getters: {
                userFromApi: vi.fn().mockReturnValue({}),
                accessToken: vi.fn(),
            },
        },
    },
}

describe('DescriptionDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                project: {
                    ...ProjectFactory.generate(),
                    organizations: [OrganizationOutputFactory.generate()],
                },
                isOpened: true,
            },
            store,
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
