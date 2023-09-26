import { lpiMount } from '../../../../helpers/LpiMount'
import SdgsFilter from '@/components/peopleKit/Filters/SdgsFilter.vue'
import SdgFactory from '../../../../factories/sdg.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const sdgs = SdgFactory.generateMany(17).map((sdg, index) => ({ ...sdg, id: index + 1 }))

const sdgsSelection = {}
for (const sdg of sdgs) {
    sdgsSelection[sdg.id] = false
}

function buildStore() {
    return {
        modules: {
            sdgs: {
                namespaced: true,
                getters: {
                    all: () => sdgs,
                },
            },
        },
    }
}

function params(modelValue) {
    return {
        props: {
            modelValue,
        },
        store: buildStore(),
    }
}

describe('SdgsFilter', () => {
    let wrapper

    it('should render SdgsFilter component', () => {
        wrapper = lpiMount(SdgsFilter, params([]))

        expect(wrapper.exists()).toBeTruthy()
    })

    it('select and deselect sdg', () => {
        wrapper = lpiMount(SdgsFilter, params([]))
        const vm: any = wrapper.vm

        expect(vm.sdgsFilters).toEqual({ ...sdgsSelection })
        vm.toggleSdg(1)
        expect(vm.sdgsFilters).toEqual({ ...sdgsSelection, ...{ '1': true } })
        vm.toggleSdg(1)
        expect(vm.sdgsFilters).toEqual({ ...sdgsSelection })
    })

    it('emit selected sdg', () => {
        wrapper = lpiMount(SdgsFilter, params([]))
        const vm: any = wrapper.vm
        vm.toggleSdg(1)
        vm.toggleSdg(3)
        vm.toggleSdg(11)
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('have preselected sdgs selected', () => {
        wrapper = lpiMount(SdgsFilter, params([1, 3, 11]))
        const vm: any = wrapper.vm
        expect(vm.sdgsFilters).toEqual({
            ...sdgsSelection,
            ...{ '1': true, '3': true, '11': true },
        })
    })

    it('have to unselect preselected sdg', () => {
        wrapper = lpiMount(SdgsFilter, params([1, 3, 11]))
        const vm: any = wrapper.vm
        vm.toggleSdg(3)
        expect(vm.sdgsFilters).toEqual({ ...sdgsSelection, ...{ '1': true, '11': true } })
    })
})
