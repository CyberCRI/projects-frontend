import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateNewsPage from '@/pages/CreateNewsPage/CreateNewsPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CreateNewsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(CreateNewsPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
