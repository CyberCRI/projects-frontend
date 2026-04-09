import { lpiMount } from '@/../tests/helpers/LpiMount'
import NavPanelLayout from '@/components/base/layouts/NavPanelLayout.vue'

import { describe, expect, it } from 'vitest'

describe('NavPanelLayout.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NavPanelLayout, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
