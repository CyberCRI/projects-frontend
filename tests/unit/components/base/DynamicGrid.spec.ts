import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import DynamicGrid from '@/components/base/DynamicGrid.vue'

import { describe, expect, it } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('DynamicGrid.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
        }
    })

    it('should render DynamicGrid component', () => {
        wrapper = lpiMount(DynamicGrid, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
