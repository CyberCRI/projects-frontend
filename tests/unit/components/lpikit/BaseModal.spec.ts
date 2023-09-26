import { lpiShallowMount } from '../../../helpers/LpiMount'
import BaseModal from '@/components/lpikit/BaseModal/BaseModal.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('BaseModal', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {},
        }
    })

    it('should render BaseModal component', () => {
        wrapper = lpiShallowMount(BaseModal, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should emit the close event', () => {
        wrapper = lpiShallowMount(BaseModal, defaultParams)
        const vm: any = wrapper.vm

        vm.close()
        expect(wrapper.emitted('close')).toBeTruthy()
    })
})
