import GroupPageInner from '@/pages/GroupPage/GroupPageInner.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/../i18n.config'
import { flushPromises } from '@vue/test-utils'

import MockComponent from '@/../tests/helpers/MockComponent.vue'
import { getGroup, getGroupMember, getGroupProject } from '@/api/groups.service'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

vi.mock('@/api/groups.service', () => ({
    getGroup: vi.fn().mockResolvedValue({
        id: 123,
        permissions: [], // TODO: remove from model
        users: [], // TODO: remove from model
        name: 'string',
        description: 'string',
        email: 'group@test.com',
        type: 'group',
        organization: 'TEST',
        managers: [],
        members: [],
        hierarchy: [],
        children: [],
        projects: [],
        header_image: { variations: { medium: 'string.jpeg' } },
        logo_image: null,
        publication_status: 'public',
    }),
    getGroupMember: vi.fn().mockResolvedValue({ results: [] }),
    getGroupProject: vi.fn().mockResolvedValue({ results: [] }),
}))

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const buildParams = (groupId) => ({
    i18n,
    router: [
        { path: '/', name: 'home', component: MockComponent },
        { path: '/page404', name: 'page404', component: MockComponent },
    ],
    props: {
        groupId,
    },
})

describe('GroupPageInner', () => {
    let usersStore
    beforeEach(() => {
        usePeopleGroupsStore(pinia)
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { code: 'TEST' } as unknown as OrganizationOutput

        usersStore = useUsersStore(pinia)
        usersStore.id = 123
        usersStore.userFromApi = {}
        usersStore.permissions = {}
        usersStore.getUser = vi.fn()
    })
    afterEach(() => {
        usersStore.$reset()
    })
    it('should render GroupPageInner component', () => {
        let wrapper = lpiShallowMount(GroupPageInner, buildParams('123'))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should load group data', async () => {
        let wrapper = lpiShallowMount(GroupPageInner, buildParams('123'))
        let vm: any = wrapper.vm
        expect(vm.isLoading).toBe(true)
        await flushPromises()
        expect(getGroup).toHaveBeenCalled()
        expect(getGroupMember).toHaveBeenCalled()
        expect(getGroupProject).toHaveBeenCalled()
        expect(vm.isLoading).toBe(false)
    })
    // TODO: Fix this test since migrating people group store to pinia
    // it('should display a 404 if no group found', async () => {
    //     vi.mocked(getGroup).mockRejectedValueOnce({ response: { status: 404 } })
    //     let wrapper = lpiShallowMount(GroupPageInner, buildParams('123'))
    //     await (wrapper.vm as any).$nextTick() // Wait for component to be fully mounted
    //     vi.spyOn((wrapper.vm as any).$router, 'replace')
    //     await flushPromises()
    //     expect((wrapper.vm as any).$router.replace).toHaveBeenCalledWith({
    //         name: 'page404',
    //         params: {
    //             pathMatch: [''],
    //         },
    //     })
    // })

    it('should not display a edit button button if not allowed', async () => {
        let wrapper = lpiShallowMount(GroupPageInner, buildParams('123'))

        await flushPromises()
        expect(wrapper.find('.edit-btn').exists()).toBe(false)
    })

    it('should display a edit button button if allowed', async () => {
        usersStore.permissions = {
            'organizations.change_peoplegroup': true,
        }
        let wrapper = lpiShallowMount(GroupPageInner, buildParams('123'))

        await flushPromises()
        expect(wrapper.find('.edit-btn').exists()).toBe(true)
    })

    it('should display a breadcrumb if group has parents', async () => {
        vi.mocked(getGroup).mockResolvedValue({
            id: 123,
            permissions: [], // TODO: remove from model
            users: [], // TODO: remove from model
            name: 'string',
            description: 'string',
            email: 'group@test.com',
            type: 'group',
            organization: 'TEST',
            managers: [],
            members: [],
            hierarchy: [{ id: 1, name: 'parent', children: [] }],
            children: [],
            projects: [],
            header_image: { variations: { medium: 'string.jpeg' } },
            logo_image: null,
            publication_status: 'public',
        })

        let wrapper = lpiShallowMount(GroupPageInner, buildParams('123'))

        await flushPromises()
        expect(wrapper.find('bread-crumbs-stub').exists()).toBe(true)
    })

    it('should display subgroups if group has children', async () => {
        vi.mocked(getGroup).mockResolvedValue({
            id: 123,
            permissions: [], // TODO: remove from model
            users: [], // TODO: remove from model
            name: 'string',
            description: 'string',
            email: 'group@test.com',
            type: 'group',
            organization: 'TEST',
            managers: [],
            members: [],
            hierarchy: [],
            children: [{ id: 1, name: 'child', children: [] }],
            projects: [],
            header_image: { variations: { medium: 'string.jpeg' } },
            logo_image: null,
            publication_status: 'public',
        })
        let wrapper = lpiShallowMount(GroupPageInner, buildParams('123'))

        await flushPromises()
        expect(wrapper.find('sub-groups-stub').exists()).toBe(true)
    })
})
