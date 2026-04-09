import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsfeedProjectItem from '@/components/home/HomeNewsfeed/NewsfeedProjectItem.vue'

import { describe, expect, it } from 'vitest'

describe('NewsfeedProjectItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsfeedProjectItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
