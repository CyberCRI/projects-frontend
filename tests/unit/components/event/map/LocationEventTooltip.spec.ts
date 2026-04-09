import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationEventTooltip from '@/components/event/map/LocationEventTooltip.vue'

import { describe, expect, it } from 'vitest'

describe('LocationEventTooltip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationEventTooltip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
