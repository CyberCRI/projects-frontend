import { lpiShallowMount } from '../../../../helpers/LpiMount'
import VueI18n from 'vue-i18n'
import english from '@/locales/en.json'
import AmbiguousResults from '@/components/search/FilterTags/AmbiguousResults.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('AmbiguousResults', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                label: 'AmbiguousResults',
                ambiguousTerm: 'foo',
            },
            i18n,
        }
    })

    it('should render AmbiguousResults component', () => {
        wrapper = lpiShallowMount(AmbiguousResults, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
