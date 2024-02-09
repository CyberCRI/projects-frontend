import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import TagResult from '@/components/lpikit/FilterTags/TagResult.vue'

import { beforeEach, describe, expect, it } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('TagResult', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                label: 'Test',
                isAmbiguous: false,
            },
        }
    })

    it('should render TagResult component', () => {
        wrapper = lpiShallowMount(TagResult, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
