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

    it('should find the large size selector', () => {
        defaultParams.props.size = 'large'
        wrapper = lpiMount(LpiButton, defaultParams)
        const size = wrapper.find('.large')
        expect(size.exists()).toBeTruthy()
    })

    it('should find the small size selector', () => {
        defaultParams.props.size = 'link'
        wrapper = lpiMount(LpiButton, defaultParams)
        const size = wrapper.find('.link')
        expect(size.exists()).toBeTruthy()
    })

    it('should find the secondary selector', () => {
        defaultParams.props.secondary = true
        wrapper = lpiMount(LpiButton, defaultParams)
        const secondary = wrapper.find('.secondary')
        expect(secondary.exists()).toBeTruthy()
    })

    it('should show a left icon', () => {
        defaultParams.props.leftIcon = 'Plus'
        wrapper = lpiMount(LpiButton, defaultParams)
        const leftIcon = wrapper.find('.left-icon')
        expect(leftIcon.exists()).toBeTruthy()
    })

    it('should show a right icon', () => {
        defaultParams.props.rightIcon = 'Plus'
        wrapper = lpiMount(LpiButton, defaultParams)
        const rightIcon = wrapper.find('.right-icon')
        expect(rightIcon.exists()).toBeTruthy()
    })
})
