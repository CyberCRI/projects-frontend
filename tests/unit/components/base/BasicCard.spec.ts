import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import BasicCard from '@/components/base/BasicCard.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

describe('BasicCard', () => {
    it('should render BasicCard component', () => {
        const wrapper = lpiShallowMount(BasicCard)

        expect(wrapper.exists()).toBeTruthy()
    })
})
