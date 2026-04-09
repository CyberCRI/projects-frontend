import { lpiMount } from '@/../tests/helpers/LpiMount'
import HomeHeaderConnected from '@/components/home/HomeHeader/HomeHeaderConnected.vue'

import { describe, expect, it } from 'vitest'

describe('HomeHeaderConnected.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HomeHeaderConnected, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
