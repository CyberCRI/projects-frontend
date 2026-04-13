import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('BaseGroupTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(BaseGroupTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
