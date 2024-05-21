import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectsByOrg from '@/components/stats/Charts/ProjectsByOrg.vue'

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
]

describe('ProjectsByOrg.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ProjectsByOrg, {
            props: {
                stats,
            },
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
