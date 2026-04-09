import { lpiMount } from '@/../tests/helpers/LpiMount'
import LocationsLink from '@/components/home/LocationsLink/LocationsLink.vue'

import { describe, expect, it } from 'vitest'

describe('LocationsLink.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LocationsLink, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
