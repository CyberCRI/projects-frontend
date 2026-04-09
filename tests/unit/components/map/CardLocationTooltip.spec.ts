import { lpiMount } from '@/../tests/helpers/LpiMount'
import CardLocationTooltip from '@/components/map/CardLocationTooltip.vue'

import { describe, expect, it } from 'vitest'

describe('CardLocationTooltip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CardLocationTooltip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
