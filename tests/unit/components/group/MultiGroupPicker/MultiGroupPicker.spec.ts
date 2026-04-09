import { lpiMount } from '@/../tests/helpers/LpiMount'
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'

import { describe, expect, it } from 'vitest'

describe('MultiGroupPicker.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MultiGroupPicker, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
