import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import SearchOptionDropDown from '@/components/lpikit/DropDown/SearchOptionDropDown.vue'

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
        }
    })

    it('should render SearchOptionDropDown component', () => {
        wrapper = lpiMount(SearchOptionDropDown, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
