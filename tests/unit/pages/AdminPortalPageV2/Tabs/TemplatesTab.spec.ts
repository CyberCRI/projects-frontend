import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplatesTab from '@/pages/AdminPortalPageV2/Tabs/TemplatesTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('TemplatesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(TemplatesTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
