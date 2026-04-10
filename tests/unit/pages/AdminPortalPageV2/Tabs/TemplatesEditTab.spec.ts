import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesEditTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('TemplatesEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(TemplatesEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
