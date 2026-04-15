import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import NewsListPage from '@/pages/NewsListPage/NewsListPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('NewsListPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(NewsListPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
