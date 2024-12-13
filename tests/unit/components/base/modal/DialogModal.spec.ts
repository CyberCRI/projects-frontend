import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import DialogModal from '@/components/base/modal/DialogModal.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('DialogModal', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {},
        }
    })

    it('should render DialogModal component', () => {
        wrapper = lpiShallowMount(DialogModal, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should emit the close event', () => {
        wrapper = lpiShallowMount(DialogModal, defaultParams)
        const vm: any = wrapper.vm

        vm.close()
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit the submit event', () => {
        wrapper = lpiShallowMount(DialogModal, defaultParams)
        const vm: any = wrapper.vm

        vm.submit()
        expect(wrapper.emitted('submit')).toBeTruthy()
    })
})
