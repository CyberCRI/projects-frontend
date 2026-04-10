import { lpiMount } from '@/../tests/helpers/LpiMount'
import MapPage from '@/pages/MapPage/MapPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('MapPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(MapPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
