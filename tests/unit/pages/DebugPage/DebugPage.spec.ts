import { lpiMount } from '@/../tests/helpers/LpiMount'
import DebugPage from '@/pages/DebugPage/DebugPage.vue'

import { describe, expect, it } from 'vitest'

describe('DebugPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DebugPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
