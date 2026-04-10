import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkCreateTab from '@/pages/AdminPortalPageV2/Tabs/LinkCreateTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('LinkCreateTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(LinkCreateTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
