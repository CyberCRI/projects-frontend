import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectHeader from '@/components/project/ProjectHeader.vue'
import { ProjectFactory, ProjectOutputFactory } from '@/../tests/factories/project.factory'
import permissions from '@/mixins/permissions'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/mixins/permissions')
;(permissions.computed.canEditProject as Mock).mockImplementation(() => true)

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('ProjectHeader.vue', () => {
    beforeEach(() => {
        const usersStore = useUsersStore(pinia)
        usersStore.$patch({
            id: 123,
            userFromApi: {},
            permissions: {},
            getUser: vi.fn(),
        } as any)
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { code: 'foo' } as unknown as OrganizationOutput
    })

    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectHeader, {
            props: {
                project: ProjectOutputFactory.generate(),
            },
            i18n,
            router: [
                { path: '/', component: MockComponent },
                { path: '/blank', component: MockComponent, name: 'blank' },
                { path: '/blank', component: MockComponent, name: 'HomeRoot' },
                { path: '/blank', component: MockComponent, name: 'Category' },
                { path: '/blank', component: MockComponent, name: 'Categories' },
            ],
            provide: {
                projectLayoutGoToTab: vi.fn(),
                projectLayoutToggleAddModal: vi.fn(),
            },
            stubs: {
                TagsList: {
                    props: ['prefix'],
                    template: '<div></div>',
                },
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
