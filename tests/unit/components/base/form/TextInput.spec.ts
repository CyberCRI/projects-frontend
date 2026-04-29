import TextInput from '~/components/base/form/TextInput.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('TextInput.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(TextInput)
    expect(wrapper.exists()).toBe(true)
  })

  it('emits input event', () => {
    const wrapper = lpiMount(TextInput)
    wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
