import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiDropDown from '@/components/base/form/LpiDropDown.vue'

import { describe, expect, it } from 'vitest'

describe('LpiDropDown.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LpiDropDown, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
