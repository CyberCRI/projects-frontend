import { lpiShallowMount } from '../../../../helpers/LpiMount'
import CompleteProfileStep2 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep2.vue'
import { describe, expect, it } from 'vitest'
import { loadLocaleMessages } from '@/locales/i18n'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const store = {
    modules: {
        users: {
            namespaced: true,
            getters: {
                kid: vi.fn(),
            },
        },
    },
}

describe('CompleteProfileStep1.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
        }
    })

    it('should render component', () => {
        wrapper = lpiShallowMount(CompleteProfileStep2, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
