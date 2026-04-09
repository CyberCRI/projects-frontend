import { lpiMount } from '@/../tests/helpers/LpiMount'
import DebugIcons from '@/pages/DebugPage/Tabs/DebugIcons.vue'

import { describe, expect, it } from 'vitest'

describe('DebugIcons.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DebugIcons, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
