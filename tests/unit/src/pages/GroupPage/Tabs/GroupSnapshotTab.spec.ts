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

const protoProps = () => ({
    description: '',

    projectsInitialRequest: {},

    isProjectsLoading: true,

    membersInitialRequest: {},

    isMembersLoading: true,

    isLoading: true,
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
        let wrapper = lpiShallowMount(GroupSnapshotTab, buildParams(protoProps()))

        expect(wrapper.exists()).toBeTruthy()
    })
})
