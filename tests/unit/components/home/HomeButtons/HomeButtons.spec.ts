import { lpiMount } from '@/../tests/helpers/LpiMount'
import HomeButtons from '@/components/home/HomeButtons/HomeButtons.vue'

import { describe, expect, it } from 'vitest'

describe('HomeButtons.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HomeButtons, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
