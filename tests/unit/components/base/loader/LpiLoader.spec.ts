import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import { loadLocaleMessages } from '@/../i18n.config'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

const factory = (propsData?) => {
    return lpiMount(LpiLoader, {
        props: {
            ...propsData,
        },
        i18n,
    })
}

describe('LpiLoader.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ type: 'simple' })
        expect(wrapper.exists()).toBe(true)
    })

    it('should display simple loader', () => {
        const wrapper = factory({ type: 'simple' })
        const type = wrapper.find('.loader-simple')

        expect(type.exists()).toBeTruthy()
    })

    it('should display complex loader', () => {
        const wrapper = factory({ type: 'complex' })
        const type = wrapper.find('.loader-complex')

        expect(type.exists()).toBeTruthy()
    })
})
