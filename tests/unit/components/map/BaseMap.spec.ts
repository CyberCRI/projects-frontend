import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseMap from '@/components/map/BaseMap.vue'

import { describe, expect, it } from 'vitest'

describe('BaseMap.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseMap, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
