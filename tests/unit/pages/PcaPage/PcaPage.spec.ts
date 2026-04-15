import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import PcaPage from '@/pages/PcaPage/PcaPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('PcaPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(PcaPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
