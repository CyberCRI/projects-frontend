import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsFeed from '@/components/app/NewsFeed.vue'

import { describe, expect, it } from 'vitest'

describe('NewsFeed.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsFeed, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
