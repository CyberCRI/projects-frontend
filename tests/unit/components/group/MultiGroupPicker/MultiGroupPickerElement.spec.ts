import { lpiMount } from '@/../tests/helpers/LpiMount'
import MultiGroupPickerElement from '@/components/group/MultiGroupPicker/MultiGroupPickerElement.vue'

import { describe, expect, it } from 'vitest'

describe('MultiGroupPickerElement.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MultiGroupPickerElement, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
