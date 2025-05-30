import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import SwitchInput from '@/components/base/form/SwitchInput.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('SwitchInput.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(SwitchInput, {})
    expect(wrapper.exists()).toBe(true)
  })

  it('toggles value', () => {
    const wrapper = lpiShallowMount(SwitchInput, {})
    const vm: any = wrapper.vm

    vm.toggleValue()
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
  })
})
