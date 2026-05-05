import LpiSelect from '~/components/base/form/LpiSelect.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
const props = {
  options: [
    {
      dataTest: 'options-recommended',
      value: 'recommended',
      label: 'recommended',
    },
    {
      dataTest: 'options-updated',
      value: '-updated_at',
      label: 'updated at',
    },
    {
      dataTest: 'options-test',
      value: 'test',
      label: 'test',
    },
  ],
  modelValue: 'recommended',
}

describe('LpiSelect.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(LpiSelect, { props })
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit event on select change', async () => {
    const wrapper = lpiMount(LpiSelect, { props })
    const vm: any = wrapper.vm

    // click on elements options
    wrapper.find<HTMLElement>(`[data-test='options-test']`).element.click()

    await flushPromises()
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual('test')
  })
})
