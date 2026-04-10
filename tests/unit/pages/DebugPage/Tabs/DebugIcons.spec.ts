import { lpiMount } from '@/../tests/helpers/LpiMount'
import DebugIcons from '@/pages/DebugPage/Tabs/DebugIcons.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('DebugIcons.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(DebugIcons, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
