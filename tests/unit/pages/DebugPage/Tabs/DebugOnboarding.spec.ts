import { lpiMount } from '@/../tests/helpers/LpiMount'
import DebugOnboarding from '@/pages/DebugPage/Tabs/DebugOnboarding.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('DebugOnboarding.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(DebugOnboarding, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
