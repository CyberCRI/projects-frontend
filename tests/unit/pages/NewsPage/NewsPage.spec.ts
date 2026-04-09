import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsPage from '@/pages/NewsPage/NewsPage.vue'

import { describe, expect, it } from 'vitest'

describe('NewsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
