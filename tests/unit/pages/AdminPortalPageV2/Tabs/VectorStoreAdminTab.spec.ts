import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import VectorStoreAdminTab from '~/pages/AdminPortalPageV2/Tabs/VectorStoreAdminTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('VectorStoreAdminTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(VectorStoreAdminTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
