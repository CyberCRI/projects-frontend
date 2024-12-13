import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import TimeOrgChart from '@/components/stats/Charts/TimeOrgChart.vue'

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
        created_count: 56,
        updated_count: 174,
        month: '2022-06-01',
    },
    {
        created_count: 92,
        updated_count: 154,
        month: '2022-05-01',
    },
    {
        created_count: 78,
        updated_count: 204,
        month: '2022-04-01',
    },
    {
        created_count: 68,
        updated_count: 64,
        month: '2022-03-01',
    },
    {
        created_count: 20,
        updated_count: 4,
        month: '2022-02-01',
    },
    {
        created_count: 100,
        updated_count: 24,
        month: '2022-01-01',
    },
    {
        created_count: 78,
        updated_count: 54,
        month: '2021-12-01',
    },
    {
        created_count: 138,
        updated_count: 84,
        month: '2021-11-01',
    },
    {
        created_count: 90,
        updated_count: 14,
        month: '2021-10-01',
    },
    {
        created_count: 30,
        updated_count: 24,
        month: '2021-09-01',
    },
    {
        created_count: 30,
        updated_count: 24,
        month: '2021-08-01',
    },
    {
        created_count: 30,
        updated_count: 24,
        month: '2021-07-01',
    },
]

describe('TimeOrgChart.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(TimeOrgChart, {
            props: {
                stats,
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
