import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import SuggestedTags from '@/components/lpikit/FilterTags/SuggestedTags.vue'

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
        languages: {
            namespaced: true,
            state: {
                current: 'en',
                all: ['en', 'fr'],
            },
        },
    },
}

describe('SuggestedTags', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
        }
    })

    it('should render SuggestedTags component', () => {
        wrapper = lpiShallowMount(SuggestedTags, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
