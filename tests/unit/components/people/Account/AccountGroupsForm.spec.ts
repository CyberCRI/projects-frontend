import AccountGroupsForm from '@/components/people/Account/AccountGroupsForm.vue'
import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    },
}

describe('GroupForm', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                isAddMode: true,
                modelValue: {},
            },
            i18n,
            store,
        }
    })

    it('should render GroupForm component', () => {
        wrapper = lpiShallowMount(AccountGroupsForm, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
