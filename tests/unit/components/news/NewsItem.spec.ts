import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsItem from '@/components/news/NewsItem.vue'

import { describe, expect, it } from 'vitest'

describe('NewsItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
