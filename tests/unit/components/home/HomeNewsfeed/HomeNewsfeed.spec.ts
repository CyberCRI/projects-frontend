import { lpiMount } from '@/../tests/helpers/LpiMount'
import HomeNewsfeed from '@/components/home/HomeNewsfeed/HomeNewsfeed.vue'

import { describe, expect, it } from 'vitest'

describe('HomeNewsfeed.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HomeNewsfeed, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
