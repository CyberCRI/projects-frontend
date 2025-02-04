import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import StatCard from '@/components/stats/StatCard.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('StatCard.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(StatCard, {
            props: {
                title: 'title',
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
