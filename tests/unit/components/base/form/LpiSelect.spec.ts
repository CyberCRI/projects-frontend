import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiSelect from '@/components/base/form/LpiSelect.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const props = {
    options: [
        {
            value: 'recommended',
            label: 'recommended',
        },
        {
            value: '-updated_at',
            label: 'updated at',
        },
        {
            value: 'test',
            label: 'test',
        },
    ],
    modelValue: 'recommended',
}

describe('LpiSelect.vue', () => {
    it('should render component', () => {
        const wrapper = lpiMount(LpiSelect, { props })
        expect(wrapper.exists()).toBe(true)
    })

    it('should emit event on select change', async () => {
        const wrapper = lpiMount(LpiSelect, { props })
        const vm: any = wrapper.vm

        vm.selected = { name: 'test', value: 'test' }
        await vm.$nextTick()
        expect(wrapper.emitted('update:model-value')[0][0]).toEqual('test')
    })
})
