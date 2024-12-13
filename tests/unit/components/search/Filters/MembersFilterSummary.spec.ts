import { lpiMount } from '@/../tests/helpers/LpiMount'
import MembersFilterSummary from '@/components/search/Filters/MembersFilterSummary.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const factory = (props?) => {
    return lpiMount(MembersFilterSummary, {
        props: {
            ...props,
        },
    })
}

describe('MembersFilterSummary.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ modelValue: [] })
        expect(wrapper.exists()).toBe(true)
    })

    it('should display initial selection', async () => {
        const wrapper = factory({
            modelValue: [
                { id: 'aze', name: { fullname: 'random' } },
                { id: 'zer', name: { fullname: 'random' } },
                { id: 'ert', name: { fullname: 'random' } },
            ],
        })

        const vm: any = wrapper.vm
        await vm.$nextTick()
        const filterValues = wrapper.findAll('.filter-value.actionable')

        expect(filterValues.length).toBe(3)
    })

    it('should show emit input when removing a person', async () => {
        const wrapper = factory({
            modelValue: [
                { id: 'aze', name: { fullname: 'random' } },
                { id: 'zer', name: { fullname: 'random' } },
                { id: 'ert', name: { fullname: 'random' } },
            ],
        })
        const vm: any = wrapper.vm
        await vm.$nextTick()
        const filterValue = wrapper.find('.filter-value.actionable')
        filterValue.trigger('click')
        await vm.$nextTick()
        expect(wrapper.emitted('update:model-value')).toBeTruthy()
    })
})
