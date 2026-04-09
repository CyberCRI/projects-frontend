import { lpiMount } from '@/../tests/helpers/LpiMount'
import NavPanelMenu from '@/components/base/navigation/NavPanelMenu.vue'

import { describe, expect, it } from 'vitest'

describe('NavPanelMenu.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NavPanelMenu, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
