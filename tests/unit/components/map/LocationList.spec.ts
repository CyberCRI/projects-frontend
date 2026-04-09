import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationList from '@/components/map/LocationList.vue'

import { describe, expect, it } from 'vitest'

describe('LocationList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
