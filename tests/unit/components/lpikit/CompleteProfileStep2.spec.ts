import { lpiMount, lpiShallowMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import CompleteProfileStep2 from '@/components/lpikit/CompleteProfileDrawer/CompleteProfileStep2.vue'

import { describe, expect, it } from 'vitest'
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
