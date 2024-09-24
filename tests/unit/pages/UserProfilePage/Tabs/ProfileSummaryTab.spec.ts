import ProfileSummaryTab from '@/pages/UserProfilePage/Tabs/ProfileSummaryTab.vue'
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

describe('ProfileSummaryTab', () => {
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { id: 'TEST' } as unknown as OrganizationOutput
    })

    it('should render ProfileSummaryTab component', () => {
        let wrapper = lpiShallowMount(ProfileSummaryTab, buildParams(UserFactory.generate()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should see that current user is the logged one', () => {
        const id = 123
        const user: any = UserFactory.generate()
        user.id = id

        store.modules.users.getters.id.mockReturnValue(id)
        let wrapper = lpiShallowMount(ProfileSummaryTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(vm.isCurrentUser).toBeTruthy()
    })

    it('should see that current user is not the logged one', () => {
        const user: any = UserFactory.generate()
        user.id = 123

        store.modules.users.getters.id.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileSummaryTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(vm.isCurrentUser).toBeFalsy()
    })

    it('should fetch user followed projects', async () => {
        const user = UserFactory.generate()
        let wrapper = lpiShallowMount(ProfileSummaryTab, buildParams(user))

        await flushPromises()
        expect(getUserFollows).toHaveBeenCalled()
    })

    it('should display a message if user has no bio set', async () => {
        const user = UserFactory.generate()
        user.personal_description = null
        user.professional_description = null
        let wrapper = lpiShallowMount(ProfileSummaryTab, buildParams(user))

        await flushPromises()
        expect(wrapper.find('user-descriptions-stub').exists()).toBe(false)
        expect(wrapper.find('.empty-field').exists()).toBe(true)
    })

    it('should display bio if user has one', async () => {
        const user = UserFactory.generate()
        let wrapper = lpiShallowMount(ProfileSummaryTab, buildParams(user))

        await flushPromises()
        expect(wrapper.find('user-descriptions-stub').exists()).toBe(true)
        expect(wrapper.find('.empty-field').exists()).toBe(false)
    })
})
