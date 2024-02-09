import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProfileCompletedModal from '@/components/lpikit/WelcomeModal/ProfileCompletedModal.vue'
import { describe, expect, it } from 'vitest'
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
                current: () => OrganizationOutputFactory.generate(),
            },
        },
    },
}

describe('ProfileCompletedModal.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
        }
    })

    it('should render ProfileCompletedModal component', () => {
        wrapper = lpiMount(ProfileCompletedModal, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the close event', () => {
            wrapper = lpiShallowMount(ProfileCompletedModal, defaultParams)
            const vm: any = wrapper.vm

            vm.skip()
            expect(wrapper.emitted('close')).toBeTruthy()
        }),
        it('should emit the take-tour event', () => {
            wrapper = lpiShallowMount(ProfileCompletedModal, defaultParams)
            const vm: any = wrapper.vm

            vm.takeTour()
            expect(wrapper.emitted('take-tour')).toBeTruthy()
        })
})
