import ProfileProjectTab from '@/pages/UserProfilePage/Tabs/ProfileProjectTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/locales/i18n'
import { flushPromises } from '@vue/test-utils'

import { getUserFollows } from '@/api/follows.service'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

vi.mock('@/api/follows.service', () => ({
    getUserFollows: vi.fn().mockResolvedValue({ results: [] }),
}))

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
                id: vi.fn(),
                userFromApi: vi.fn(),
                getPermissions: vi.fn().mockReturnValue({}),
                isConnected: vi.fn().mockReturnValue(true),
            },
            actions: {
                getUser: vi.fn(),
            },
        },
    },
}

const buildParams = (user) => ({
    i18n,
    store,
    props: {
        user,
    },
})

describe('ProfileProjectTab', () => {
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { id: 'TEST' } as unknown as OrganizationOutput
    })

    it('should render ProfileProjectTab component', () => {
        let wrapper = lpiShallowMount(ProfileProjectTab, buildParams(UserFactory.generate()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should fetch user followed projects', async () => {
        const user = UserFactory.generate()
        let wrapper = lpiShallowMount(ProfileProjectTab, buildParams(user))

        await flushPromises()
        expect(getUserFollows).toHaveBeenCalled()
    })

    it('should display 3 project lists', async () => {
        const user = UserFactory.generate()
        let wrapper = lpiShallowMount(ProfileProjectTab, buildParams(user))

        await flushPromises()
        expect(wrapper.findAll('user-project-list-stub').length).toBe(3)
    })

    it('should not display a create project button if not on self profile', async () => {
        const user = UserFactory.generate()
        let wrapper = lpiShallowMount(ProfileProjectTab, buildParams(user))

        await flushPromises()
        expect(wrapper.find('.create-project').exists()).toBe(false)
    })

    it('should display a create project button if on self profile and has persimission', async () => {
        const id = 123
        const user: any = UserFactory.generate()
        user.id = id

        store.modules.users.getters.id.mockReturnValue(id)
        let wrapper = lpiShallowMount(ProfileProjectTab, buildParams(user))

        await flushPromises()
        expect(wrapper.find('.create-project').exists()).toBe(true)
    })
})
