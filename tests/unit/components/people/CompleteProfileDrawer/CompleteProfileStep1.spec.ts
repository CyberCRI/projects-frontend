import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import CompleteProfileStep1 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep1.vue'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'

import { describe, expect, it } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('CompleteProfileStep1.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const usersStore = useUsersStore(pinia)
        usersStore.$patch({
            id: 123,
            userFromApi: {},
            getPermissions: {},
            getUser: vi.fn(),
        } as any)
        defaultParams = {
            i18n,
        }
    })

    it('should render component', () => {
        const wrapper = lpiShallowMount(CompleteProfileStep1, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the saving event', () => {
            wrapper = lpiShallowMount(CompleteProfileStep1, defaultParams)
            const vm: any = wrapper.vm

            vm.save()
            expect(wrapper.emitted('saving')).toBeTruthy()
        })
})
