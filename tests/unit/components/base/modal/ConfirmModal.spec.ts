import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'

import { beforeEach, describe, expect, it } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('ConfirmModal.vue', () => {
    let defaultParams
    let wrapper

    beforeEach(() => {
        defaultParams = {
            i18n,
        }
    })

    it('should render ConfirmModal component', () => {
        wrapper = lpiMount(ConfirmModal, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
