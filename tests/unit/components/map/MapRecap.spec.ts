import { lpiMount } from '@/../tests/helpers/LpiMount'
import MapRecap from '@/components/map/MapRecap.vue'

import { describe, expect, it } from 'vitest'

describe('MapRecap.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MapRecap, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
