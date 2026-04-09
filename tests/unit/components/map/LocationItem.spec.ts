import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationItem from '@/components/map/LocationItem.vue'

import { describe, expect, it } from 'vitest'

describe('LocationItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
