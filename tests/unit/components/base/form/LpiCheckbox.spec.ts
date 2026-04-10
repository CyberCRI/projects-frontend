import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import { flushPromises } from '@vue/test-utils'
import { MODEL_PROVIDER_CONFIG } from 'langchain/chat_models/universal'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('LpiCheckbox', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        label: 'checkbox',
        modelValue: false,
      },
    }
  })

  it('should render LpiCheckbox component', () => {
    wrapper = lpiShallowMount(LpiCheckbox, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render label', () => {
    wrapper = lpiShallowMount(LpiCheckbox, defaultParams)

    const label = wrapper.find('input')

    expect(label.exists()).toBeTruthy()
  })

  it('should render label and input', () => {
    wrapper = lpiShallowMount(LpiCheckbox, defaultParams)

    const label = wrapper.find('.lpi-checkbox')
    const input = wrapper.find('input')

    expect(label.exists()).toBeTruthy()
    expect(input.exists()).toBeTruthy()
  })

  it('should emit input event', async () => {
    wrapper = lpiShallowMount(LpiCheckbox, {
      props: {
        ...defaultParams.props,
        modelValue: false,
        'onUpdate:modelValue': (e) => wrapper?.setProps({ modelValue: e }),
      },
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.props('modelValue')).toBe(true)
  })
})
