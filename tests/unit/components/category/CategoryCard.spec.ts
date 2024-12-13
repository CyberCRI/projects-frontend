import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryCard from '@/components/category/CategoryCard.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const category = {
    background_color: '#00DBA7',
    foreground_color: 'white',
    name: 'LPI Projects',
}

const factory = (propsData?) => {
    return lpiMount(CategoryCard, {
        props: {
            ...propsData,
        },
    })
}

describe('CategoryCard.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ category, selected: true, size: 'big' })
        expect(wrapper.exists()).toBe(true)
    })

    it('should display check icon', () => {
        const wrapper = factory({ category, selected: true, size: 'big' })
        const vm: any = wrapper.vm
        const checkIcon = wrapper.find('.icon')

        expect(checkIcon.exists()).toBeTruthy()
        expect(vm.selected).toBe(true)
    })

    it('should not display check icon', () => {
        const wrapper = factory({ category, selected: false, size: 'big' })
        const vm: any = wrapper.vm
        const checkIcon = wrapper.find('.icon')

        expect(checkIcon.exists()).toBeFalsy()
        expect(vm.selected).toBe(false)
    })

    it('should display big category card', () => {
        const wrapper = factory({ category, selected: false, size: 'big' })
        const vm: any = wrapper.vm

        expect(vm.imageWidth).toBe('344px')
        expect(vm.imageHeight).toBe('137px')
    })

    it('should display small category card', () => {
        const wrapper = factory({ category, selected: false, size: 'small' })
        const vm: any = wrapper.vm

        expect(vm.imageWidth).toBe('222px')
        expect(vm.imageHeight).toBe('50px')
    })
})
