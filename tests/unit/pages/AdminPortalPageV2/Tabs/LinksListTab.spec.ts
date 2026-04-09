import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinksListTab from '@/pages/AdminPortalPageV2/Tabs/LinksListTab.vue'

import { describe, expect, it } from 'vitest'

describe('LinksListTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LinksListTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
