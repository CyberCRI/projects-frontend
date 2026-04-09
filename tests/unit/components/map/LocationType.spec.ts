import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationType from '@/components/map/LocationType.vue'

import { describe, expect, it } from 'vitest'

describe('LocationType.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationType, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
