import TemplatesCreateTab from '~/pages/AdminPortalPageV2/Tabs/TemplatesCreateTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('TemplatesCreateTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(TemplatesCreateTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
