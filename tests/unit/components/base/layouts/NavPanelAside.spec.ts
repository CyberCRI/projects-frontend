import { lpiMount } from '@/../tests/helpers/LpiMount'
import NavPanelAside from '@/components/base/layouts/NavPanelAside.vue'

import { describe, expect, it } from 'vitest'

describe('NavPanelAside.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NavPanelAside, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
