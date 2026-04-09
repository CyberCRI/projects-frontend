import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkCreateTab from '@/pages/AdminPortalPageV2/Tabs/LinkCreateTab.vue'

import { describe, expect, it } from 'vitest'

describe('LinkCreateTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LinkCreateTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
