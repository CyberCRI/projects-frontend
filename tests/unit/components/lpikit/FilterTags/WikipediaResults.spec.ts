import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import WikipediaResults from '@/components/lpikit/FilterTags/WikipediaResults.vue'

import { beforeEach, describe, expect, it } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('WikipediaResults', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
        }
    })

    it('should render WikipediaResults component', () => {
        wrapper = lpiShallowMount(WikipediaResults, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
