import { lpiMount } from '@/../tests/helpers/LpiMount'
import HeaderDropDown from '@/components/base/navigation/HeaderDropDown.vue'

import { describe, expect, it } from 'vitest'

describe('HeaderDropDown.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HeaderDropDown, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
