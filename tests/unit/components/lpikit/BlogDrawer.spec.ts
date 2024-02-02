import { lpiMount, lpiShallowMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import BlogDrawer from '@/components/lpikit/BlogDrawer/BlogDrawer.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    ...ProjectOutputFactory.generate(),
                    files: [],
                    links: [],
                }),
                currentProjectId: vi.fn(() => 123),
            },
        },
        organizations: {
            namespaced: true,
            getters: {
                current: () => OrganizationOutputFactory.generate(),
            },
        },
        users: {
            namespaced: true,
            getters: {
                userFromApi: vi.fn(),
                accessToken: vi.fn(),
            },
            state: {
                keycloak_id: '123',
            },
        },
        blogEntries: {
            namespaced: true,
            actions: {
                postBlogEntry: vi.fn(),
            },
        },
        languages: {
            namespaced: true,
            state: {
                current: 'en',
                all: ['en', 'fr'],
            },
        },
    },
}

describe('BlogDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                isOpened: true,
                initialStep: 2,
            },
            i18n,
            store,
            provide: {
                projectLayoutProjectPatched: vi.fn(),
            },
        }
    })

    it('should render component', () => {
        const wrapper = lpiMount(BlogDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the close event', () => {
            wrapper = lpiShallowMount(BlogDrawer, defaultParams)
            const vm: any = wrapper.vm

            vm.closeDrawer()
            expect(wrapper.emitted('close')).toBeTruthy()
        })
})
