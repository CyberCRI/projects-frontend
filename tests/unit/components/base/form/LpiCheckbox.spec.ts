import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('LpiCheckbox', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                label: 'checkbox',
                checkedValue: false,
            },
        }
    })

    it('should render LpiCheckbox component', () => {
        wrapper = lpiShallowMount(LpiCheckbox, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should render label', () => {
        wrapper = lpiShallowMount(LpiCheckbox, defaultParams)

        const label = wrapper.find('input')

        expect(label.exists()).toBeTruthy()
    })

    it('should render label and input', () => {
        wrapper = lpiShallowMount(LpiCheckbox, defaultParams)

        const label = wrapper.find('.lpi-checkbox')
        const input = wrapper.find('input')

        expect(label.exists()).toBeTruthy()
        expect(input.exists()).toBeTruthy()
    })

    it('should emit input event', () => {
        wrapper = lpiShallowMount(LpiCheckbox, defaultParams)
        const event = {
            target: {
                value: !defaultParams.props.checkedValue,
            },
        }

        wrapper.vm.toggle(event)

        expect(wrapper.emitted('update:modelValue', true)).toBeTruthy()
    })
})
