import { lpiMount } from '@/../tests/helpers/LpiMount'
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'

import { describe, expect, it } from 'vitest'

describe('HtmlLimiter.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HtmlLimiter, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
