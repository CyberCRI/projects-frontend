import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinksListTab from '@/pages/AdminPortalPageV2/Tabs/LinksListTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('LinksListTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(LinksListTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
