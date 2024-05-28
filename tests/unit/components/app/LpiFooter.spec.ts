import { lpiShallowMount, lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import LpiFooter from '@/components/app/LpiFooter.vue'
import { OrganizationOutputFactory } from '../../../../tests/factories/organization.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import MockComponent from '../../../helpers/MockComponent.vue'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        organizations: {
            namespaced: true,
            getters: {
                current: () => OrganizationOutputFactory.generate(),
            },
        },
        users: {
            namespaced: true,
            getters: {
                isConnected: vi.fn(),
            },
        },
        languages: {
            namespaced: true,
            state: {
                current: 'fr',
                all: ['en', 'fr'],
            },
        },
    },
}

const router = [
    { path: '/', component: MockComponent },
    { path: '/help', component: MockComponent },
    { path: '/terms-of-service', component: MockComponent },
    { path: '/legal-notices', component: MockComponent },
    { path: '/cookies', component: MockComponent },
    { path: '/accessibility', component: MockComponent },
    { path: '/personal-data', component: MockComponent },
    { path: '/blank', component: MockComponent, name: 'blank' },
    {
        path: '/register',
        component: MockComponent,
        name: 'Register',
    },
]

describe('LpiFooter', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
            router,
        }
    })

    it('should render LpiFooter component', () => {
        wrapper = lpiShallowMount(LpiFooter, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should render full component', () => {
        const wrapper = lpiMount(LpiFooter, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
