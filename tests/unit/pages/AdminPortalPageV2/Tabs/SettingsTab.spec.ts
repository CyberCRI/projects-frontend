import { lpiMount } from '@/../tests/helpers/LpiMount'
import SettingsTab from '@/pages/AdminPortalPageV2/Tabs/SettingsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('SettingsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(SettingsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
