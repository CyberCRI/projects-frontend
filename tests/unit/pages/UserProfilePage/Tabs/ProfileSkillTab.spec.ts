import ProfileSkillTab from '@/pages/UserProfilePage/Tabs/ProfileSkillTab.vue'
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

const buildParams = (user) => ({
    i18n,
    store,
    props: {
        user,
    },
})

describe('ProfileSkillTab', () => {
    it('should render ProfileSkillTab component', () => {
        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(UserFactory.generate()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should see that current user is the logged one', () => {
        const keycloak_id = '123'
        const user: any = UserFactory.generate()
        user.keycloak_id = keycloak_id

        store.modules.users.getters.kid.mockReturnValue(keycloak_id)
        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(vm.isCurrentUser).toBeTruthy()
    })

    it('should see that current user is not the logged one', () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'

        store.modules.users.getters.kid.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(vm.isCurrentUser).toBeFalsy()
    })

    it('should display a message if no kill and no hobby', () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'

        store.modules.users.getters.kid.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(wrapper.find('.empty-field').exists()).toBe(true)
        expect(wrapper.findAll('user-skills-stub').length).toBe(0)
    })

    it('should display one list if user has skill but no hobby', () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        user.skills = [{ id: '123' }]
        store.modules.users.getters.kid.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(wrapper.find('.empty-field').exists()).toBe(false)
        expect(wrapper.findAll('user-skills-stub').length).toBe(1)
    })

    it('should display one list if user has hobbies but no skills', () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        user.hobbies = [{ id: '123' }]
        store.modules.users.getters.kid.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(wrapper.find('.empty-field').exists()).toBe(false)
        expect(wrapper.findAll('user-skills-stub').length).toBe(1)
    })

    it('should display two lists if user has hobbies and skills', () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        user.hobbies = [{ id: '123' }]
        user.skills = [{ id: '123' }]
        store.modules.users.getters.kid.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
        let vm: any = wrapper.vm
        expect(wrapper.find('.empty-field').exists()).toBe(false)
        expect(wrapper.findAll('user-skills-stub').length).toBe(2)
    })

    it('should display a tip if list are displayed', () => {
        const user: any = UserFactory.generate()
        user.keycloak_id = '123'
        user.hobbies = [{ id: '123' }]
        user.skills = [{ id: '123' }]
        store.modules.users.getters.kid.mockReturnValue('456')

        let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))

        expect(wrapper.find('skill-level-tip-stub').exists()).toBe(true)
    })
})
