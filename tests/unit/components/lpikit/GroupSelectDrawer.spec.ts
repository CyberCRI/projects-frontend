import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GroupSelectDrawer from '@/components/lpikit/GroupSelectDrawer/GroupSelectDrawer.vue'
import { describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'

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
    },
}
describe('GroupSelectDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                isOpened: false,
            },
            store,
        }
    })

    it('should render GroupSelectDrawer component', () => {
        wrapper = lpiMount(GroupSelectDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
