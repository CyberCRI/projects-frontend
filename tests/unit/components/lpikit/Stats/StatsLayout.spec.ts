import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import StatsLayout from '@/components/lpikit/Stats/StatsLayout.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const stats = {
    byMonth: [
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
    ],
    byOrganization: [
        {
            project_count: 23,
            name: 'Learning Planet',
            code: 'LEARNINGPLANET',
        },
        {
            project_count: 34,
            name: 'Cri',
            code: 'CRI',
        },
        {
            project_count: 32,
            name: 'Eurip',
            code: 'EURIP',
        },
        {
            project_count: 23,
            name: 'Learning Planet',
            code: 'LEARNINGPLANET',
        },
        {
            project_count: 34,
            name: 'Cri',
            code: 'CRI',
        },
        {
            project_count: 32,
            name: 'Eurip',
            code: 'EURIP',
        },
        {
            project_count: 23,
            name: 'Learning Planet',
            code: 'LEARNINGPLANET',
        },
        {
            project_count: 34,
            name: 'Cri',
            code: 'CRI',
        },
        {
            project_count: 32,
            name: 'Eurip',
            code: 'EURIP',
        },
        {
            project_count: 23,
            name: 'Learning Planet',
            code: 'LEARNINGPLANET',
        },
        {
            project_count: 34,
            name: 'Cri',
            code: 'CRI',
        },
        {
            project_count: 32,
            name: 'Eurip',
            code: 'EURIP',
        },
    ],
    bySdg: [
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
    ],
    byTags: [
        {
            name_fr: 'éducation',
            project_count: 284,
        },
        {
            name_fr: 'brouillon',
            project_count: 254,
        },
        {
            name_fr: 'biologie',
            project_count: 214,
        },
        {
            name_fr: 'science',
            project_count: 194,
        },
        {
            name_fr: 'écologie',
            project_count: 174,
        },
        {
            name_fr: 'relecture',
            project_count: 154,
        },
        {
            name_fr: 'mathématiques',
            project_count: 134,
        },
        {
            name_fr: 'sciences participatives',
            project_count: 124,
        },
        {
            name_fr: 'développement durable',
            project_count: 104,
        },
        {
            name_fr: 'vulgarisation',
            project_count: 84,
        },
    ],
}

describe('StatsLayout.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(StatsLayout, {
            props: {
                stats,
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
