import BrowseLayout from '@/components/search/BrowseLayout/BrowseLayout.vue'
import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserFactory } from '../../../../factories/user.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        users: {
            namespaced: true,
            getters: {
                isConnected: () => false,
            },
        },
    },
}

const route = {
    query: {
        section: 'all',
    },
}

describe('BrowseLayout', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = { code: 'TEST' } as unknown as OrganizationOutput
        defaultParams = {
            props: {
                isAddMode: true,
                selectedUser: UserFactory.generate(),
            },
            i18n,
            store,
            global: {
                mocks: {
                    $route: route,
                },
            },
        }
    })

    it('should render BrowseLayout component', () => {
        wrapper = lpiShallowMount(BrowseLayout, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
