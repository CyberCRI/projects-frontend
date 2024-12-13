import AccountForm from '@/components/people/Account/AccountForm.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserFactory } from '@/../tests/factories/user.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('AccountForm', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        defaultParams = {
            props: {
                isAddMode: true,
                selectedUser: UserFactory.generate(),
            },
            i18n,
        }
    })

    it('should render AccountForm component', () => {
        wrapper = lpiShallowMount(AccountForm, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
