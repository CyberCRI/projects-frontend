import AccountLayout from '@/components/lpikit/Account/AccountLayout.vue'
import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserFactory } from '../../../../factories/user.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('AccountLayout', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                isAddMode: true,
                selectedUser: UserFactory.generate(),
            },
            i18n,
        }
    })

    it('should render AccountLayout component', () => {
        wrapper = lpiShallowMount(AccountLayout, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
