import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import CompleteProfileStep1 from '@/components/people/CompleteProfileDrawer/CompleteProfileStep1.vue'

import { describe, expect, it } from 'vitest'

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
                kid: vi.fn(),
            },
            actions: {
                getUser: vi.fn(),
            },
        },
        notififications: {
            namespaced: true,
            actions: {
                pushToast: vi.fn(),
            },
        },
    },
}

describe('CompleteProfileStep1.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
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
