import { lpiShallowMount } from '../../../../helpers/LpiMount'
import SdgRecap from '@/components/project/sdg/SdgRecap.vue'
import english from '@/locales/en.json'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const factory = (propsData?) => {
    return lpiShallowMount(SdgRecap, {
        props: {
            ...propsData,
        },
        i18n,
        provide: { projectLayoutToggleAddModal: vi.fn() },
    })
}

describe('SdgRecap.vue', () => {
    beforeEach(() => {
        const organizationsStore = useOrganizationsStore(pinia)
        organizationsStore.current = OrganizationOutputFactory.generate()
    })
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })
})
