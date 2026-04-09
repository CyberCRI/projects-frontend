import { lpiMount } from '@/../tests/helpers/LpiMount'
import MenuTip from '@/components/base/MenuTip.vue'

import { describe, expect, it } from 'vitest'

describe('MenuTip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MenuTip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
