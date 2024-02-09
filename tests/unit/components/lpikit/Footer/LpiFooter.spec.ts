import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import LpiFooter from '@/components/lpikit/Footer/LpiFooter.vue'
import { OrganizationOutputFactory } from '../../../../../tests/factories/organization.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import MockComponent from '../../../../helpers/MockComponent.vue'

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

describe('LpiFooter', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
            router: [
                {
                    path: '/register',
                    component: MockComponent,
                    name: 'Register',
                },
                {
                    path: '/',
                    component: MockComponent,
                    name: 'Home',
                },
            ],
        }
    })

    it('should render LpiFooter component', () => {
        wrapper = lpiShallowMount(LpiFooter, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
