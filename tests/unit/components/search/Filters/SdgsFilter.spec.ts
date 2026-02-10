import { lpiMount } from '@/../tests/helpers/LpiMount'
import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'
import SdgFactory from '@/../tests/factories/sdg.factory'

import { describe, expect, it } from 'vitest'
const sdgs = SdgFactory.generateMany(17).map((sdg, index) => ({ ...sdg, id: index + 1 }))

const sdgsSelection = []
for (const sdg of sdgs) {
  sdgsSelection.push(sdg.id)
}

function params(modelValue) {
  return {
    props: {
      modelValue,
    },
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

    expect(vm.model).toEqual([])
    vm.toggleSdg(1)
    expect(vm.model).toEqual([1])
    vm.toggleSdg(1)
    expect(vm.model).toEqual([])
  })

  it('emit selected sdg', async () => {
    wrapper = lpiMount(SdgsFilter, params([]))
    const vm: any = wrapper.vm
    vm.toggleSdg(1)
    vm.toggleSdg(3)
    vm.toggleSdg(11)
    expect(vm.model).toEqual([1, 3, 11])
  })

  it('have preselected sdgs selected', () => {
    wrapper = lpiMount(SdgsFilter, params([1, 3, 11]))
    const vm: any = wrapper.vm

    expect(vm.model).toEqual([1, 3, 11])
  })

  it('have to unselect preselected sdg', () => {
    wrapper = lpiMount(SdgsFilter, params([1, 3, 11]))
    const vm: any = wrapper.vm
    vm.toggleSdg(3)
    expect(vm.model).toEqual([1, 11])
  })
})
