import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import BlogDrawer from '@/components/project/blog/BlogDrawer.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { loadLocaleMessages } from '@/locales/i18n'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const store = {
    modules: {
        users: {
            namespaced: true,
            getters: {
                userFromApi: vi.fn(),
                accessToken: vi.fn(),
            },
            state: {
                keycloak_id: '123',
            },
        },
    },
}

describe('BlogDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        const projectsStore = useProjectsStore(pinia)

        projectsStore.project = {
            ...ProjectOutputFactory.generate(),
            files: [],
            links: [],
        }
        defaultParams = {
            props: {
                isOpened: true,
                initialStep: 2,
            },
            i18n,
            store,
            provide: {
                projectLayoutProjectPatched: vi.fn(),
            },
        }
    })

    it('should render component', () => {
        const wrapper = lpiMount(BlogDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the close event', () => {
            wrapper = lpiShallowMount(BlogDrawer, defaultParams)
            const vm: any = wrapper.vm

            vm.closeDrawer()
            expect(wrapper.emitted('close')).toBeTruthy()
        })
})
