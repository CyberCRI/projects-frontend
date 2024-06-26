import GroupMembersTab from '@/pages/GroupPage/Tabs/GroupMembersTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { DOMWrapper, flushPromises } from '@vue/test-utils'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

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
            state: {
                current: {
                    code: 'TEST',
                },
            },
            getters: {
                current: vi.fn().mockReturnValue({ id: 'TEST' }),
            },
        },
        peopleGroups: {
            namespaced: true,
            actions: {
                getPeopleGroups: vi.fn(),
                setCurrentId: vi.fn(),
            },
        },
    },
}

const protoPropsLoading = () => ({
    membersInitialRequest: {},

    isMembersLoading: true,
})

const protoPropsLoaded = (members = []) => ({
    membersInitialRequest: { count: members.length, results: members },

    isMembersLoading: false,
})

const buildParams = (props) => ({
    i18n,
    store,
    router: [
        { path: '/', name: 'home', component: MockComponent },
        { path: '/page404', name: 'page404', component: MockComponent },
    ],
    props,
})

describe('GroupMembersTab', () => {
    it('should render GroupMembersTab component', () => {
        let wrapper = lpiShallowMount(GroupMembersTab, buildParams(protoPropsLoading()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display memeber count when loaded', async () => {
        let wrapper = lpiShallowMount(GroupMembersTab, buildParams(protoPropsLoading()))

        expect(wrapper.find('.members-header .title span').exists()).toBe(false)

        wrapper.setProps(protoPropsLoaded([{ id: 1 }, { id: 2 }]))

        await wrapper.vm.$nextTick()

        let counter = wrapper.find('.members-header .title span')

        expect(counter.exists()).toBe(true)

        expect(counter.html()).toContain('2')
    })
})
