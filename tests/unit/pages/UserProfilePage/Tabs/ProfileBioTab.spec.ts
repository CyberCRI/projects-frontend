import ProfileBioTab from '@/pages/UserProfilePage/Tabs/ProfileBioTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/locales/i18n'
import { flushPromises } from '@vue/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

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
        organizations: {
            namespaced: true,
            getters: {
                current: vi.fn().mockReturnValue({ id: 'TEST' }),
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

describe('ProfileBioTab', () => {
    it('should render ProfileBioTab component', () => {
        let wrapper = lpiShallowMount(ProfileBioTab, buildParams(UserFactory.generate()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should see that current user is the logged one', () => {
        const id = '123'
        const user: any = UserFactory.generate()
        user.id = id

        store.modules.users.getters.id.mockReturnValue(id)
        let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(vm.isCurrentUser).toBeTruthy()
    })

    it('should see that current user is not the logged one', () => {
        const user: any = UserFactory.generate()
        user.id = '123'

        store.modules.users.getters.id.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(vm.isCurrentUser).toBeFalsy()
    })

    it('should display a message if user has no bio set', async () => {
        const user = UserFactory.generate()
        user.personal_description = null
        user.professional_description = null
        let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))

        await flushPromises()
        expect(wrapper.find('user-descriptions-stub').exists()).toBe(false)
        expect(wrapper.find('.empty-field').exists()).toBe(true)
    })

    it('should display bio if user has one', async () => {
        const user = UserFactory.generate()
        let wrapper = lpiShallowMount(ProfileBioTab, buildParams(user))

        await flushPromises()
        expect(wrapper.find('user-descriptions-stub').exists()).toBe(true)
        expect(wrapper.find('.empty-field').exists()).toBe(false)
    })
})
