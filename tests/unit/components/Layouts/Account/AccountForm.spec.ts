import AccountForm from '@/components/lpikit/Account/AccountForm.vue'
import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserFactory } from '../../../../factories/user.factory'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        organizations: {
            namespaced: true,
            getters: {
                current: vi.fn(() => OrganizationOutputFactory.generate()),
            },
        },
        notifications: {
            namespaced: true,
            actions: {
                pushToast: vi.fn(),
            },
        },
    },
}

describe('AccountForm', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                isAddMode: true,
                selectedUser: UserFactory.generate(),
            },
            i18n,
            store,
        }
    })

    it('should render AccountForm component', () => {
        wrapper = lpiShallowMount(AccountForm, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
