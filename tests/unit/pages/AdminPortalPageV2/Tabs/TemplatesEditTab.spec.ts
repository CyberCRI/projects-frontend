import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesEditTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('TemplatesEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TemplatesEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
