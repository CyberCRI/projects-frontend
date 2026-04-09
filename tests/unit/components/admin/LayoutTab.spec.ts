import { lpiMount } from '@/../tests/helpers/LpiMount'
import LayoutTab from '@/components/admin/LayoutTab.vue'

import { describe, expect, it } from 'vitest'

describe('LayoutTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LayoutTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
