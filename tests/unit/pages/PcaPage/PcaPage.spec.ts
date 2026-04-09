import { lpiMount } from '@/../tests/helpers/LpiMount'
import PcaPage from '@/pages/PcaPage/PcaPage.vue'

import { describe, expect, it } from 'vitest'

describe('PcaPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PcaPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
