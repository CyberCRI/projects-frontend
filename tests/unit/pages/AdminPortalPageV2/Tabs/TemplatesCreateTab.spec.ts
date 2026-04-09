import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesCreateTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesCreateTab.vue'

import { describe, expect, it } from 'vitest'

describe('TemplatesCreateTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TemplatesCreateTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
