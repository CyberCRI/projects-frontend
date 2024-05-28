import { lpiShallowMount } from '../../../../helpers/LpiMount'
import HomeCarousel from '@/components/home/HomeCarousel/HomeCarousel.vue'
import { loadLocaleMessages } from '@/locales/i18n'
import imageMixin from '@/mixins/imageMixin'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}
describe('HomeCarousel', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {},
            i18n,
            mixins: [imageMixin],
        }
    })

    it('should render HomeCarousel component', () => {
        wrapper = lpiShallowMount(HomeCarousel, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
