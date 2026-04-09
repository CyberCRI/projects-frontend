import { lpiMount } from '@/../tests/helpers/LpiMount'
import PickProjectsDrawer from '@/components/project/PickProjectsDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('PickProjectsDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PickProjectsDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
