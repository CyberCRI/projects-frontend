import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import UserProfile from '@/components/Profile/UserProfile.vue'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/locales/i18n'
import { getUser } from '@/api/people.service'
import { flushPromises } from '@vue/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

vi.mock('@/api/people.service.ts', () => ({
    getUser: vi.fn(),
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
                kid: vi.fn(),
                userFromApi: vi.fn(),
                getPermissions: vi.fn().mockReturnValue({}),
            },
            actions: {
                getUser: vi.fn(),
            },
        },
        organizations: {
            namespaced: true,
            getters: {
                current: vi.fn().mockReturnValue({ id: 'TEST' }),
            },
        },
    },
}

const buildParams = (kid, showPageLink) => ({
    i18n,
    store,
    props: {
        kid, // UserFactory.generate(),
        showPageLink,
    },
})

describe('UserProfile', () => {
    it('should render UserProfile component', () => {
        let wrapper = lpiShallowMount(UserProfile, buildParams('123', false))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should use logged user if no id is provided', () => {
        let wrapper = lpiShallowMount(UserProfile, buildParams(null, false))

        expect(store.modules.users.actions.getUser).toHaveBeenCalled()
    })

    it("should emit 'user-not-found' if no user found", async () => {
        vi.mocked(getUser).mockRejectedValue(null)

        let wrapper = lpiShallowMount(UserProfile, buildParams('123', false))
        await flushPromises()
        expect(wrapper.emitted()['user-not-found']).toBeTruthy()
    })

    it('should see that current user is the logged one', async () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        vi.mocked(getUser).mockResolvedValue(user)
        store.modules.users.getters.userFromApi.mockReturnValue(user)
        let wrapper = lpiShallowMount(UserProfile, buildParams('123', false))
        let vm: any = wrapper.vm
        await flushPromises()
        expect(vm.isSelf).toBeTruthy()
    })

    it('should see that current user is not the logged one', async () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        vi.mocked(getUser).mockResolvedValue(user)

        const user2: any = UserFactory.generate()
        user.keycloak_id = '456'
        store.modules.users.getters.userFromApi.mockReturnValue(user2)

        let wrapper = lpiShallowMount(UserProfile, buildParams('123', false))
        let vm: any = wrapper.vm
        await flushPromises()
        expect(vm.isSelf).toBeFalsy()
    })

    it('should allow edition of self profile', async () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        vi.mocked(getUser).mockResolvedValue(user)
        store.modules.users.getters.userFromApi.mockReturnValue(user)
        let wrapper = lpiShallowMount(UserProfile, buildParams('123', false))
        await flushPromises()
        expect(wrapper.find('.edit-btn').exists()).toBe(true)
    })

    it('should not allow edition of other profile without specific rights', async () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        vi.mocked(getUser).mockResolvedValue(user)

        const user2: any = UserFactory.generate()
        user.keycloak_id = '456'
        store.modules.users.getters.userFromApi.mockReturnValue(user2)

        let wrapper = lpiShallowMount(UserProfile, buildParams('123', false))
        await flushPromises()
        expect(wrapper.find('.edit-btn').exists()).toBe(false)
    })

    it('should display a loader first then the content', async () => {
        let wrapper = lpiShallowMount(UserProfile, buildParams('123', false))
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
