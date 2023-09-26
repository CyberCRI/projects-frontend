import { lpiShallowMount } from '../../../helpers/LpiMount'
import TermsOfService from '@/components/lpikit/TermsOfService/TermsOfService.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('TermsOfService.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(TermsOfService, {})
        expect(wrapper.exists()).toBe(true)
    })
})
