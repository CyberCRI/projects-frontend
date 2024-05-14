import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

import { describe, expect, it } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('CroppedImage.vue', () => {
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                src: 'test',
            },
        }
    })

    it('should render CroppedImage component', () => {
        const wrapper = lpiMount(CroppedImage, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
