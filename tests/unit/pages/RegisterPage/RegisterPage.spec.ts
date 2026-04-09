import { lpiMount } from '@/../tests/helpers/LpiMount'
import RegisterPage from '@/pages/RegisterPage/RegisterPage.vue'

import { describe, expect, it } from 'vitest'

describe('RegisterPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(RegisterPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
