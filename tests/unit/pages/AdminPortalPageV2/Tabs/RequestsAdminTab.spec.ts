import RequestsAdminTab from '~/pages/AdminPortalPageV2/Tabs/RequestsAdminTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('RequestsAdminTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(RequestsAdminTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
