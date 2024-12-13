import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('AccountFormTitleBlock', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                isAddMode: true,
            },
            i18n,
        }
    })

    it('should render AccountFormTitleBlock component', () => {
        wrapper = lpiShallowMount(AccountFormTitleBlock, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
