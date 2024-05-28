import { lpiMount } from '../../../../helpers/LpiMount'
import WelcomedModal from '@/components/onboarding/WelcomeModal/WelcomeModal.vue'
import { describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import { loadLocaleMessages } from '@/locales/i18n'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
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

describe('WelcomedModal.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
        }
    })

    it('should render WelcomedModal component', () => {
        wrapper = lpiMount(WelcomedModal, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
