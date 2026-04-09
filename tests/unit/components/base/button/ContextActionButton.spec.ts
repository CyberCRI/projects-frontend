import { lpiMount } from '@/../tests/helpers/LpiMount'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

import { describe, expect, it } from 'vitest'

describe('ContextActionButton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ContextActionButton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
