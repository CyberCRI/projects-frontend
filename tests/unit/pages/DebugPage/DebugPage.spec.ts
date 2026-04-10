import { lpiMount } from '@/../tests/helpers/LpiMount'
import DebugPage from '@/pages/DebugPage/DebugPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('DebugPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(DebugPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
