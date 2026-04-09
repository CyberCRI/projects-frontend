import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationNewsTooltip from '@/components/news/map/LocationNewsTooltip.vue'

import { describe, expect, it } from 'vitest'

describe('LocationNewsTooltip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationNewsTooltip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
