import GroupSnapshotTab from '@/pages/GroupPage/Tabs/GroupSnapshotTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/locales/i18n'
import { flushPromises } from '@vue/test-utils'
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
    description: '',

    projectsInitialRequest: {},

    membersInitialRequest: {},

    isProjectsLoading: true,

    isMembersLoading: true,

    isLoading: true,
})

const protoPropsLoaded = (members = [], projects = []) => ({
    description: '<p>lorem ipsum</p>',

    projectsInitialRequest: { count: projects.length, results: projects },

    membersInitialRequest: { count: members.length, results: members },

    isProjectsLoading: false,

    isMembersLoading: false,

    isLoading: false,
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

describe('GroupSnapshotTab', () => {
    it('should render GroupSnapshotTab component', () => {
        let wrapper = lpiShallowMount(GroupSnapshotTab, buildParams(protoPropsLoading()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display loading state then render', async () => {
        let wrapper = lpiShallowMount(GroupSnapshotTab, buildParams(protoPropsLoading()))

        expect(wrapper.find('.skeleton').exists()).toBe(true)
        expect(wrapper.find('.projects .see-more-button').exists()).toBe(false)
        expect(wrapper.find('.members .see-more-button').exists()).toBe(false)

        wrapper.setProps(protoPropsLoaded([{ id: 1 }], [{ id: 2 }]))

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.skeleton').exists()).toBe(false)
        expect(wrapper.find('.projects .see-more-button').exists()).toBe(true)
        expect(wrapper.find('.members .see-more-button').exists()).toBe(true)
    })

    it("should not display list section when there's no project or member", async () => {
        let wrapper = lpiShallowMount(GroupSnapshotTab, buildParams(protoPropsLoaded([], [])))

        expect(wrapper.find('.skeleton').exists()).toBe(false)
        expect(wrapper.find('.projects').exists()).toBe(false)
        expect(wrapper.find('.members').exists()).toBe(false)
    })
})
