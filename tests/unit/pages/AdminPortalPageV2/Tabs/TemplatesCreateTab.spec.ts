import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import TemplatesCreateTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesCreateTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('TemplatesCreateTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(TemplatesCreateTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
