import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import WelcomedModal from '@/components/lpikit/WelcomeModal/WelcomeModal.vue'
import { describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'

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
