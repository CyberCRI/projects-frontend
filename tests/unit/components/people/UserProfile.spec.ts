import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import UserProfile from '@/components/people/UserProfile.vue'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/../i18n.config'
import { getUser } from '@/api/people.service'
import { flushPromises } from '@vue/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
import permissions from '@/mixins/permissions'
vi.mock('@/api/people.service.ts', () => ({
    getUser: vi.fn(() => Promise.resolve({ id: 12, permissions: [] })),
}))

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const buildParams = (userId, showPageLink) => ({
    i18n,
    props: {
        userId, // UserFactory.generate(),
        showPageLink,
    },
})

describe('UserProfile', () => {
    let usersStore
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.$patch({ current: { id: 'TEST' } as unknown as OrganizationOutput })
        usersStore = useUsersStore()
        usersStore.$patch({
            id: 12,
            userFromApi: {},
            permissions: {},
        })
    })
    afterEach(() => {
        usersStore.$reset()
    })
    it('should render UserProfile component', () => {
        let wrapper = lpiShallowMount(UserProfile, buildParams(123, false))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should use logged user if no id is provided', () => {
        let wrapper = lpiShallowMount(UserProfile, buildParams(null, false))

        expect(usersStore.getUser).toHaveBeenCalled()
    })

    it("should emit 'user-not-found' if no user found", async () => {
        vi.mocked(getUser).mockRejectedValue(null)

        let wrapper = lpiShallowMount(UserProfile, buildParams(123, false))
        await flushPromises()
        expect(wrapper.emitted()['user-not-found']).toBeTruthy()
    })

    it('should see that current user is the logged one', async () => {
        const user: any = UserFactory.generate()
        user.id = 123
        vi.mocked(getUser).mockResolvedValue(user)
        usersStore.userFromApi = user
        let wrapper = lpiShallowMount(UserProfile, buildParams(123, false))
        let vm: any = wrapper.vm
        await flushPromises()
        expect(vm.isSelf).toBeTruthy()
    })

    it('should see that current user is not the logged one', async () => {
        const user: any = UserFactory.generate()
        user.id = 123
        vi.mocked(getUser).mockResolvedValue(user)

        const user2: any = UserFactory.generate()
        user2.id = 456
        usersStore.userFromApi = user2

        let wrapper = lpiShallowMount(UserProfile, buildParams(123, false))
        let vm: any = wrapper.vm
        await flushPromises()
        expect(vm.isSelf).toBeFalsy()
    })

    it('should allow edition of self profile', async () => {
        const user: any = UserFactory.generate()
        user.id = 123
        vi.mocked(getUser).mockResolvedValue(user)
        usersStore.userFromApi = user
        let wrapper = lpiShallowMount(UserProfile, buildParams(123, false))
        await flushPromises()
        expect(wrapper.find('.edit-btn').exists()).toBe(true)
    })

    it('should not allow edition of other profile without specific rights', async () => {
        const user: any = UserFactory.generate()
        user.id = 123
        vi.mocked(getUser).mockResolvedValue(user)

        const user2: any = UserFactory.generate()
        user.id = 456
        usersStore.userFromApi = user2

        let wrapper = lpiShallowMount(UserProfile, buildParams(123, false))
        await flushPromises()
        expect(wrapper.find('.edit-btn').exists()).toBe(false)
    })

    it('should display a loader first then the content', async () => {
        let wrapper = lpiShallowMount(UserProfile, buildParams(123, false))
        let vm: any = wrapper.vm

        expect(vm.isLoading).toBe(true)
        expect(wrapper.find('loader-simple-stub').exists()).toBe(true)
        expect(wrapper.find('profile-header-stub').exists()).toBe(false)
        expect(wrapper.find('profile-tabs-stub').exists()).toBe(false)

        await flushPromises()

        expect(vm.isLoading).toBe(false)
        expect(wrapper.find('loader-simple-stub').exists()).toBe(false)
        expect(wrapper.find('profile-header-stub').exists()).toBe(true)
        expect(wrapper.find('profile-tabs-stub').exists()).toBe(true)
    })
})
