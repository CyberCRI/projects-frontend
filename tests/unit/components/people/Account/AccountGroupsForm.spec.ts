import AccountGroupsForm from '@/components/people/Account/AccountGroupsForm.vue'
import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GroupForm', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
        defaultParams = {
            props: {
                isAddMode: true,
                modelValue: {},
            },
            i18n,
        }
    })

    it('should render GroupForm component', () => {
        wrapper = lpiShallowMount(AccountGroupsForm, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
