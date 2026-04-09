import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesTab.vue'

import { describe, expect, it } from 'vitest'

describe('TemplatesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TemplatesTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
