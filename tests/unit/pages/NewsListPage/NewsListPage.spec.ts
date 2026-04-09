import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsListPage from '@/pages/NewsListPage/NewsListPage.vue'

import { describe, expect, it } from 'vitest'

describe('NewsListPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsListPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
