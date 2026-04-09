import { lpiMount } from '@/../tests/helpers/LpiMount'
import ErrorPage from '@/pages/ErrorPage/ErrorPage.vue'

import { describe, expect, it } from 'vitest'

describe('ErrorPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ErrorPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
