import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationTooltip from '@/components/map/LocationTooltip.vue'

import { describe, expect, it } from 'vitest'

describe('LocationTooltip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationTooltip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
