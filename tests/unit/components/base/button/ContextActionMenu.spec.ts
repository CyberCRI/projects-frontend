import { lpiMount } from '@/../tests/helpers/LpiMount'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'

import { describe, expect, it } from 'vitest'

describe('ContextActionMenu.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ContextActionMenu, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
