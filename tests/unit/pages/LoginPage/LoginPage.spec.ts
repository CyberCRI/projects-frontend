import { lpiMount } from '@/../tests/helpers/LpiMount'
import LoginPage from '@/pages/LoginPage/LoginPage.vue'

import { describe, expect, it } from 'vitest'

describe('LoginPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LoginPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
