import { lpiShallowMount } from '../../../helpers/LpiMount'
import LpiChip from '@/components/lpikit/LpiChip/LpiChip.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('Chip', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                name: 'tag',
                selected: false,
                removable: false,
            },
        }
    })

    it('should render Chip component', () => {
        wrapper = lpiShallowMount(LpiChip, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should emit the right event when clicking add', () => {
        wrapper = lpiShallowMount(LpiChip, defaultParams)

        const iconContainer = wrapper.find('.chip__right-icon')

        iconContainer.trigger('click')

        expect(iconContainer.exists()).toBeTruthy()
        expect(wrapper.emitted('add')).toBeTruthy()
        expect(wrapper.vm.rightIcon).toBe('Plus')
    })

    it('should emit the right event when clicking remove', () => {
        defaultParams.props.selected = true
        defaultParams.props.removable = true
        wrapper = lpiShallowMount(LpiChip, defaultParams)

        const iconContainer = wrapper.find('.chip__right-icon')

        iconContainer.trigger('click')

        expect(iconContainer.exists()).toBeTruthy()
        expect(wrapper.emitted('remove')).toBeTruthy()
        expect(wrapper.vm.rightIcon).toBe('Close')
    })
})
