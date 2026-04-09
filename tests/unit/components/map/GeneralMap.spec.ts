import { lpiMount } from '@/../tests/helpers/LpiMount'
import GeneralMap from '@/components/map/GeneralMap.vue'

import { describe, expect, it } from 'vitest'

describe('GeneralMap.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GeneralMap, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
