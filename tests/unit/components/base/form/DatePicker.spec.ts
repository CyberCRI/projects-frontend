import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import DatePicker from '@/components/base/form/DatePicker.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('DatePicker.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(DatePicker, { i18n })
        expect(wrapper.exists()).toBe(true)
    })
})
