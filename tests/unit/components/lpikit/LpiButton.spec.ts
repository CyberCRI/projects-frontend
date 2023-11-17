import { lpiMount } from '../../../helpers/LpiMount'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('LpiButton', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {},
        }
    })

    it('should render LpiButton component', () => {
        wrapper = lpiMount(LpiButton, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should render label', () => {
        defaultParams.props.label = 'LpiButton'

        wrapper = lpiMount(LpiButton, defaultParams)

        const label = wrapper.find('[data-test="button-label"]')

        expect(label.exists()).toBeTruthy()
    })

    it('should find the secondary selector', () => {
        defaultParams.props.secondary = true
        wrapper = lpiMount(LpiButton, defaultParams)
        const secondary = wrapper.find('.secondary')
        expect(secondary.exists()).toBeTruthy()
    })

    it('should show an icon', () => {
        defaultParams.props.btnIcon = 'Plus'
        wrapper = lpiMount(LpiButton, defaultParams)
        const btnIcon = wrapper.find('.btn-icon')
        expect(btnIcon.exists()).toBeTruthy()
    })

    it('should show a right icon', () => {
        defaultParams.props.btnIcon = 'Plus'
        defaultParams.props.reversedOrder = true
        wrapper = lpiMount(LpiButton, defaultParams)
        const btnIcon = wrapper.find('.btn-icon')
        const reversed = wrapper.find('.reversed-order')
        expect(btnIcon.exists()).toBeTruthy()
        expect(reversed.exists()).toBeTruthy()
    })
})
