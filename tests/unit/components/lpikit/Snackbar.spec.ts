import { lpiMount } from '../../../helpers/LpiMount'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const factory = (props?) => {
    return lpiMount(LpiSnackbar, {
        props: {
            text: 'test',
            ...props,
        },
    })
}

describe('LpiSnackbar.vue', () => {
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })

    it('emits close event', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        vm.close()
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should display check icon', () => {
        const wrapper = factory({ icon: 'Check', type: 'success' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(true)
    })

    it('should not display check icon if type is not success', () => {
        const wrapper = factory({ type: 'error' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(false)
    })

    it('should not display check icon if snackbar does not have icon', () => {
        const wrapper = factory({ type: 'success' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(false)
    })

    it('should display exclamation icon', () => {
        const wrapper = factory({ icon: 'ExclamationMark', type: 'error' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(true)
    })

    it('should not display check icon if type is not error or warning', () => {
        const wrapper = factory({ type: 'success' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(false)
    })

    it('should not display check icon if snackbar does not have icon', () => {
        const wrapper = factory({ type: 'error' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(false)
    })

    it('should display question mark', () => {
        const wrapper = factory({ icon: 'QuestionMark', type: 'info' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(true)
    })

    it('should not display check icon if type is not info', () => {
        const wrapper = factory({ type: 'success' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(false)
    })

    it('should not display check icon if snackbar does not have icon', () => {
        const wrapper = factory({ type: 'info' })
        const vm: any = wrapper.vm

        expect(wrapper.find('.left-icon').exists()).toBe(false)
    })
})
