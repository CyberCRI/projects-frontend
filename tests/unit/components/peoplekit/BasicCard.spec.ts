import { lpiShallowMount } from '../../../helpers/LpiMount'
import BasicCard from '@/components/peopleKit/BasicCard.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const store = {
    modules: {
        users: {
            namespaced: true,
            getters: {
                isConnected: () => true,
            },
        },
    },
}
describe('BasicCard', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            store,
        }
    })

    it('should render BasicCard component', () => {
        wrapper = lpiShallowMount(BasicCard, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
