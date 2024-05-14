import GroupForm from '@/components/lpikit/Account/GroupForm.vue'
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
        users: {
            namespaced: true,
            actions: {
                patchUser: vi.fn(),
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
                selectedUser: UserFactory.generate(),
            },
            i18n,
            store,
        }
    })

    it('should render GroupForm component', () => {
        wrapper = lpiShallowMount(GroupForm, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
