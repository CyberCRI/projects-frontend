import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import TakeTourModal from '@/components/onboarding/WelcomeModal/TakeTourModal.vue'
import { describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

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
    },
}

describe('TakeTourModal.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
            router: [
                {
                    path: '/',
                    component: MockComponent,
                    name: 'Home',
                },
                { path: '/tutorials', name: 'HelpVideoTab', component: MockComponent },
            ],
        }
    })

    it('should render TakeTourModal component', () => {
        wrapper = lpiMount(TakeTourModal, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
