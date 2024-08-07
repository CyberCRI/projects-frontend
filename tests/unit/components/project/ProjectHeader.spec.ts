import { lpiShallowMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectHeader from '@/components/project/ProjectHeader.vue'
import { ProjectFactory, ProjectOutputFactory } from '../../../factories/project.factory'
import permissions from '@/mixins/permissions'
import MockComponent from '../../../helpers/MockComponent.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import organizations from '@/store/modules/organizations'
vi.mock('@/mixins/permissions')
;(permissions.computed.canEditProject as Mock).mockImplementation(() => true)

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function buildStore() {
    return {
        modules: {
            users: {
                namespaced: true,
                getters: {
                    isConnected: () => true,
                    id: () => 123,
                },
            },
            follows: {
                namespaced: true,
                dispatch: vi.fn(),
            },
            organizations: {
                namespaced: true,
                getters: {
                    current: () => ({
                        code: 'foo',
                    }),
                },
            },
        },
    }
}

describe('ProjectHeader.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectHeader, {
            store: buildStore(),
            props: {
                project: ProjectOutputFactory.generate(),
            },
            i18n,
            router: [
                { path: '/', component: MockComponent },
                { path: '/blank', component: MockComponent, name: 'blank' },
                { path: '/blank', component: MockComponent, name: 'HomeRoot' },
                { path: '/blank', component: MockComponent, name: 'Category' },
                { path: '/blank', component: MockComponent, name: 'Categories' },
            ],
            provide: {
                projectLayoutGoToTab: vi.fn(),
                projectLayoutToggleAddModal: vi.fn(),
            },
            stubs: {
                TagsList: {
                    props: ['prefix'],
                    template: '<div></div>',
                },
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
