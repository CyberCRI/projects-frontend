import { lpiMount } from '../../../helpers/LpiMount'
import LinkCat from '@/components/shrcomponents/LinkCat.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
// Mount function
const factory = (props?) => {
    return lpiMount(LinkCat, {
        props: {
            ...props,
        },
    })
}

describe('LinkCat.vue', () => {
    it('should initialize the component with the default values', () => {
        const wrapper = factory({ label: 'test' })
        const vm: any = wrapper.vm

        wrapper.vm.$nextTick(() => {
            expect(wrapper.exists()).toBeTruthy()
        })
        expect(vm.selected).toBeFalsy()
        expect(vm.label).toBe('test')
        expect(wrapper.find('.linkcat').classes()).not.toContain('selected')
    })

    it('should apply selected class', () => {
        const wrapper = factory({ label: 'test', selected: true })
        expect(wrapper.find('.linkcat').classes()).toContain('selected')
    })

    it('should emit click event on click', () => {
        const wrapper = factory({ label: 'test', selected: true })
        const linkcat = wrapper.find('.linkcat')
        linkcat.trigger('click')
        expect(wrapper.emitted().click).toBeTruthy()
    })
})
