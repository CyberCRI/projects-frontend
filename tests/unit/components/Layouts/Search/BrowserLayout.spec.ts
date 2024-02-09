import BrowseLayout from '@/components/Layouts/Search/BrowseLayout.vue'
import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserFactory } from '../../../../factories/user.factory'

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
            state: {
                current: {
                    code: 'TEST',
                },
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
