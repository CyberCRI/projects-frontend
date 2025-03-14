import { lpiMount } from '@/../tests/helpers/LpiMount'
import TextInput from '@/components/base/form/TextInput.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const factory = (props?) => {
  return lpiMount(TextInput, {
    props: {
      ...props,
    },
  })
}

describe('TextInput.vue', () => {
  it('should render component', () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
  })

  it('emits input event', () => {
    const wrapper = factory()
    wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
