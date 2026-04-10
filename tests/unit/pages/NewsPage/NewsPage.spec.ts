import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsPage from '@/pages/NewsPage/NewsPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('NewsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(NewsPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
