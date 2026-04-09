import { lpiMount } from '@/../tests/helpers/LpiMount'
import ContextActionMenuInline from '@/components/base/button/ContextActionMenuInline.vue'

import { describe, expect, it } from 'vitest'

describe('ContextActionMenuInline.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ContextActionMenuInline, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
