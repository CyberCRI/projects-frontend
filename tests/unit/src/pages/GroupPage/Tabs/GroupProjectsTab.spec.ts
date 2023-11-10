import GroupProjectsTab from '@/pages/GroupPage/Tabs/GroupProjectsTab.vue'
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

const protoPropsLoading = () => ({
    projectsInitialRequest: {},

    isProjectsLoading: true,
})

const protoPropsLoaded = (projects = []) => ({
    projectsInitialRequest: { count: projects.length, results: projects },

    isProjectsLoading: false,
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

describe('GroupProjectsTab', () => {
    it('should render GroupProjectsTab component', () => {
        let wrapper = lpiShallowMount(GroupProjectsTab, buildParams(protoPropsLoading()))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should display project count when loaded', async () => {
        let wrapper = lpiShallowMount(GroupProjectsTab, buildParams(protoPropsLoading()))

        expect(wrapper.find('.projects-header .title span').exists()).toBe(false)

        wrapper.setProps(protoPropsLoaded([{ id: 1 }, { id: 2 }]))

        await wrapper.vm.$nextTick()

        let counter = wrapper.find('.projects-header .title span')

        expect(counter.exists()).toBe(true)

        expect(counter.html()).toContain('2')
    })
})
