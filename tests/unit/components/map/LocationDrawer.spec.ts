import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationDrawer from '@/components/map/LocationDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('LocationDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
