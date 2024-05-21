import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProfileEditBlock from '@/components/people/CompleteProfileDrawer/ProfileEditBlock.vue'

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
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
            props: {
                blockTitle: 'test',
            },
        }
    })

    it('should render component', () => {
        const wrapper = lpiMount(ProfileEditBlock, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
