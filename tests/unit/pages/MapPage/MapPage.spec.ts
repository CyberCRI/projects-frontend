import { lpiMount } from '@/../tests/helpers/LpiMount'
import MapPage from '@/pages/MapPage/MapPage.vue'

import { describe, expect, it } from 'vitest'

describe('MapPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MapPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
