import { lpiMount } from '@/../tests/helpers/LpiMount'
import SettingsTab from '@/pages/AdminPortalPageV2/Tabs/SettingsTab.vue'

import { describe, expect, it } from 'vitest'

describe('SettingsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SettingsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
