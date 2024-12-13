import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import SdgChart from '@/components/stats/Charts/SdgChart.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const stats = [
    {
        project_count: 72,
        sdg: 1,
    },
    {
        project_count: 244,
        sdg: 2,
    },
    {
        project_count: 122,
        sdg: 3,
    },
    {
        project_count: 56,
        sdg: 4,
    },
    {
        project_count: 77,
        sdg: 5,
    },
    {
        project_count: 88,
        sdg: 6,
    },
    {
        project_count: 92,
        sdg: 7,
    },
    {
        project_count: 37,
        sdg: 8,
    },
    {
        project_count: 72,
        sdg: 9,
    },
    {
        project_count: 244,
        sdg: 10,
    },
    {
        project_count: 122,
        sdg: 11,
    },
    {
        project_count: 56,
        sdg: 12,
    },
    {
        project_count: 77,
        sdg: 13,
    },
    {
        project_count: 88,
        sdg: 14,
    },
    {
        project_count: 92,
        sdg: 15,
    },
    {
        project_count: 37,
        sdg: 16,
    },
    {
        project_count: 27,
        sdg: 17,
    },
]

describe('SdgChart.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(SdgChart, {
            props: {
                stats,
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
