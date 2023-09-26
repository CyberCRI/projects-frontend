import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import SearchResults from '@/components/lpikit/FilterTags/SearchResults.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('SearchResults', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                label: 'SearchResults',
            },
            i18n,
        }
    })

    it('should render SearchResults component', () => {
        wrapper = lpiShallowMount(SearchResults, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
