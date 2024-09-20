import { lpiShallowMount } from '../../../../helpers/LpiMount'
import SdgRecap from '@/components/project/sdg/SdgRecap.vue'
import english from '@/locales/en.json'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
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
                current: () => OrganizationOutputFactory.generate(),
            },
        },

        users: {
            namespaced: true,
            getters: {
                getPermissions: vi.fn(() => []),
            },
        },
    },
}

const factory = (propsData?) => {
    return lpiShallowMount(SdgRecap, {
        props: {
            ...propsData,
        },
        store,
        i18n,
        provide: { projectLayoutToggleAddModal: vi.fn() },
    })
}

describe('SdgRecap.vue', () => {
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })
})
