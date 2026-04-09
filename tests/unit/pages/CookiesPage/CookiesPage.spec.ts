import { lpiMount } from '@/../tests/helpers/LpiMount'
import CookiesPage from '@/pages/CookiesPage/CookiesPage.vue'

import { describe, expect, it } from 'vitest'

describe('CookiesPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CookiesPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
