import { lpiMount } from '@/../tests/helpers/LpiMount'
import LineClamped from '@/components/base/LineClamped.vue'

import { describe, expect, it } from 'vitest'

describe('LineClamped.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LineClamped, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
