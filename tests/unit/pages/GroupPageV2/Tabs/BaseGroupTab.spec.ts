import BaseGroupTab from '~/pages/GroupPageV2/Tabs/BaseGroupTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('BaseGroupTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(BaseGroupTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
