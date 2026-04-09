import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiDropDownElementButton from '@/components/base/form/LpiDropDownElementButton.vue'

import { describe, expect, it } from 'vitest'

describe('LpiDropDownElementButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LpiDropDownElementButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
