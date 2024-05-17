import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import LpiLogo from '@/components/app/LpiLogo.vue'
import { beforeEach, describe, expect, it } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('LpiFooter', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
        }
    })

    it('should render LpiLogo component', () => {
        wrapper = lpiShallowMount(LpiLogo, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
