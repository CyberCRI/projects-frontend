import { lpiMount } from '@/../tests/helpers/LpiMount'
import NavPanelLoader from '@/components/base/layouts/NavPanelLoader.vue'

import { describe, expect, it } from 'vitest'

describe('NavPanelLoader.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NavPanelLoader, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
