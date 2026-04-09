import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiDropDownElement from '@/components/base/form/LpiDropDownElement.vue'

import { describe, expect, it } from 'vitest'

describe('LpiDropDownElement.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LpiDropDownElement, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
