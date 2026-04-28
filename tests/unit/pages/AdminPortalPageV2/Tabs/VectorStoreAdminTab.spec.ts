import VectorStoreAdminTab from '~/pages/AdminPortalPageV2/Tabs/VectorStoreAdminTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('VectorStoreAdminTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(VectorStoreAdminTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
