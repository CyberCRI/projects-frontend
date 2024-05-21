import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import TagChart from '@/components/stats/Charts/TagChart.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function buildStore() {
    return {
        modules: {
            languages: {
                namespaced: true,
                state: {
                    current: 'fr',
                },
            },
        },
    }
}

const stats = [
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
]

describe('TagChart.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(TagChart, {
            props: {
                stats,
            },
            i18n,
            store: buildStore(),
        })
        expect(wrapper.exists()).toBe(true)
    })
})
