import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResourceDrawer from '@/components/resources/ResourceDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ResourceDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResourceDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
