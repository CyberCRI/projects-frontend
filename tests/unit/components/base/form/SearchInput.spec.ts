import SearchInput from '~/components/base/form/SearchInput.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('SearchInput.vue', () => {
  it('renders component', () => {
    const wrapper = lpiMount(SearchInput)
    expect(wrapper.exists()).toBe(true)
  })

  it('emits enter event', () => {
    const wrapper = lpiMount(SearchInput)
    const vm: any = wrapper.vm

    vm.onEnter()
    expect(wrapper.emitted('enter')).toBeTruthy()
  })

  it('deletes input value', () => {
    const wrapper = lpiMount(SearchInput)
    const vm: any = wrapper.vm

    vm.deleteValue()
    expect(wrapper.emitted('delete-query')).toBeTruthy()
  })

  it('emits input event', async () => {
    const wrapper = lpiMount(SearchInput)

    wrapper.find('input').setValue('test')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
