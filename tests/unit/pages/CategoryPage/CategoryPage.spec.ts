import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoryPage from '@/pages/CategoryPage/CategoryPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CategoryPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(CategoryPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
