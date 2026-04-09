import { lpiMount } from '@/../tests/helpers/LpiMount'
import DebugOnboarding from '@/pages/DebugPage/Tabs/DebugOnboarding.vue'

import { describe, expect, it } from 'vitest'

describe('DebugOnboarding.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DebugOnboarding, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
