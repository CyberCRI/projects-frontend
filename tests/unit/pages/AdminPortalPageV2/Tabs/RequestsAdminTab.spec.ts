import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import RequestsAdminTab from '@/pages/AdminPortalPageV2/Tabs/RequestsAdminTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('RequestsAdminTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(RequestsAdminTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
