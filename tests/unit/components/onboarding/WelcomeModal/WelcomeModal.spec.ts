import { lpiMount } from '@/../tests/helpers/LpiMount'
import WelcomedModal from '@/components/onboarding/WelcomeModal/WelcomeModal.vue'
import { describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { loadLocaleMessages } from '@/locales/i18n'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

describe('WelcomedModal.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        defaultParams = {
            i18n,
        }
    })

    it('should render WelcomedModal component', () => {
        wrapper = lpiMount(WelcomedModal, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
