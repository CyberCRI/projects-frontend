import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import PssiPage from '@/pages/PssiPage/PssiPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('PssiPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(PssiPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
