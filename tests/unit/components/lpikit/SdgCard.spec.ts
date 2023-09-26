import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import SdgCard from '@/components/lpikit/SdgCard/SdgCard.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('SdgCard.vue', () => {
    it('should render component', () => {
        const wrapper = lpiMount(SdgCard, {
            props: {
                sdg: 1,
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
