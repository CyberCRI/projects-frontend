import ProfileGroupsTab from '@/pages/UserProfilePage/Tabs/ProfileGroupsTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/locales/i18n'
import { flushPromises } from '@vue/test-utils'

import { getGroup } from '@/api/group.service'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

vi.mock('@/api/group.service', () => ({
    getGroup: vi.fn().mockResolvedValue({ results: {} }),
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
        organizations: {
            namespaced: true,
            state: {
                current: { id: 'TEST' },
            },
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

describe('ProfileGroupsTab', () => {
    it('should render ProfileGroupsTab component', () => {
        let wrapper = lpiShallowMount(ProfileGroupsTab, buildParams(UserFactory.generate()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should fetch user groups while displaying a loader', async () => {
        const user = UserFactory.generate()
        user.people_groups = [{ id: '1' }, { id: '2' }, { id: '3' }]

        let wrapper = lpiShallowMount(ProfileGroupsTab, buildParams(user))
        const vm = wrapper.vm as any
        await vm.$nextTick()
        expect(vm.isLoading).toBe(true)
        expect(wrapper.find('.loader').exists()).toBe(true)
        expect(wrapper.find('card-list-stub').exists()).toBe(false)
        await flushPromises()
        expect(getGroup).toHaveBeenCalledTimes(3)
        expect(vm.isLoading).toBe(false)
        expect(wrapper.find('.loader').exists()).toBe(false)
        expect(wrapper.find('card-list-stub').exists()).toBe(true)
    })
})
