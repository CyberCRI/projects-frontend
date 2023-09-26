import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import CategoryBadge from '@/components/lpikit/CategoryBadge/CategoryBadge.vue'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import MockComponent from '../../../helpers/MockComponent.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const project = ProjectOutputFactory.generate()

function buildStore() {
    return {
        modules: {
            projects: {
                namespaced: true,
                dispatch: vi.fn(),
            },

            organizations: {
                namespaced: true,
                state: {
                    all: [{ code: 'CRI' }],
                    current: { code: 'CRI' },
                },
            },
        },
    }
}

const factory = (propsData?) => {
    return lpiMount(CategoryBadge, {
        router: [
            { path: '/', component: MockComponent },
            { path: '/category/:id', component: MockComponent },
            { path: '/blank', component: MockComponent, name: 'blank' },
        ],
        props: {
            ...propsData,
        },
        i18n,
        store: buildStore(),
    })
}

describe('CategoryBadge.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ project })
        expect(wrapper.exists()).toBe(true)
    })

    it("checks if main category's background is white", () => {
        const wrapper = factory({
            project: {
                ...project,
                categories: [
                    {
                        background_color: '#fff',
                        organization: 'CRI',
                    },
                ],
            },
        })
        const vm: any = wrapper.vm

        expect(vm.categoryBackgroundWhite).toBeTruthy()
    })

    it("checks if main category's background is not white", () => {
        const wrapper = factory({
            project: {
                ...project,
                categories: [
                    {
                        background_color: 'red',
                        organization: 'CRI',
                    },
                ],
            },
        })
        const vm: any = wrapper.vm

        expect(vm.categoryBackgroundWhite).toBeFalsy()
    })

    it('checks if there are multiple categories', () => {
        const wrapper = factory({ project })
        const vm: any = wrapper.vm

        expect(vm.multipleCategories).toBeTruthy()
    })
})
