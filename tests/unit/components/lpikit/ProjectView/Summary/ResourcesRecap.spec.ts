import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ResourcesRecap from '@/components/project/Recap/ResourcesRecap.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    files: [],
                    links: [],
                }),
            },
        },
    },
}

describe('ResourcesRecap.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(ResourcesRecap, {
            store,
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
