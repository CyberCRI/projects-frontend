import { lpiMount } from '@/../tests/helpers/LpiMount'
import ErrorPage from '@/pages/ErrorPage/ErrorPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ErrorPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ErrorPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
