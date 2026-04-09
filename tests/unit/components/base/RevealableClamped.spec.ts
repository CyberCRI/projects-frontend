import { lpiMount } from '@/../tests/helpers/LpiMount'
import RevealableClamped from '@/components/base/RevealableClamped.vue'

import { describe, expect, it } from 'vitest'

describe('RevealableClamped.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(RevealableClamped, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
