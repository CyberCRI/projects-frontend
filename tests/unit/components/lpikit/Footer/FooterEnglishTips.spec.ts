import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import FooterEnglishTips from '@/components/app/FooterEnglishTips.vue'

import { beforeEach, describe, expect, it } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('FooterEnglishTips', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
        }
    })

    it('should render FooterEnglishTips component', () => {
        wrapper = lpiShallowMount(FooterEnglishTips, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
