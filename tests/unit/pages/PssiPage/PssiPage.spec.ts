import { lpiMount } from '@/../tests/helpers/LpiMount'
import PssiPage from '@/pages/PssiPage/PssiPage.vue'

import { describe, expect, it } from 'vitest'

describe('PssiPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PssiPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
