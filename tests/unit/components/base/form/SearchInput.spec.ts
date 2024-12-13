import { lpiMount } from '@/../tests/helpers/LpiMount'
import SearchInput from '@/components/base/form/SearchInput.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const factory = (props?) => {
    return lpiMount(SearchInput, {
        props: {
            ...props,
        },
        directives: {
            'click-outside': vi.fn(),
        },
    })
}

describe('SearchInput.vue', () => {
    it('renders component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })

    it('emits enter event', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        vm.onEnter()
        expect(wrapper.emitted('enter')).toBeTruthy()
    })

    it('deletes input value', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        vm.deleteValue()
        expect(wrapper.emitted('delete-query')).toBeTruthy()
    })

    it('emits input event', async () => {
        const wrapper = factory()

        wrapper.find('input').setValue('test')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
})
