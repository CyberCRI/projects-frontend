import { lpiMount } from '@/../tests/helpers/LpiMount'
import PcaPage from '@/pages/PcaPage/PcaPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('PcaPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(PcaPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
