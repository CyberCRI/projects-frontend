import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import SearchOptionDropDown from '@/components/search/SearchOptionDropDown/SearchOptionDropDown.vue'
import { ALL_SECTION_KEY } from '@/components/search/Filters/useSectionFilters'

import { describe, expect, it } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('SearchOptionDropDown.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                selectedSection: ALL_SECTION_KEY,
            },
        }
    })

    it('should render SearchOptionDropDown component', () => {
        wrapper = lpiMount(SearchOptionDropDown, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
