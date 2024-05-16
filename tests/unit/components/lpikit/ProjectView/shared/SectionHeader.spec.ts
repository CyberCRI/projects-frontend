import { lpiShallowMount } from '../../../../../helpers/LpiMount'
import SectionHeader from '@/components/project/SectionHeader/SectionHeader.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('SectionHeader.vue', () => {
    it('should render component', () => {
        const wrapper = lpiShallowMount(SectionHeader, {
            props: {
                title: 'test',
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})
