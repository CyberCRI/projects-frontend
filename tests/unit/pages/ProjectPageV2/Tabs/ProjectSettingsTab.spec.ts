import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectSettingsTab from '@/pages/ProjectPageV2/Tabs/ProjectSettingsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectSettingsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectSettingsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
