import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import OnboardingScreens from '@/components/app/Footer/OnboardingScreens.vue'
import { beforeEach, describe, expect, it } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        users: {
            namespaced: true,
            getters: {
                userFromApi: vi.fn(),
            },
        },
    },
}

describe('OnboardingScreens', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
        }
    })

    it('should render OnboardingScreens component', () => {
        wrapper = lpiShallowMount(OnboardingScreens, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
