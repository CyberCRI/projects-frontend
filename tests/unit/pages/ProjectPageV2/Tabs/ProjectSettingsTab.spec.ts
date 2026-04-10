import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectSettingsTab from '@/pages/ProjectPageV2/Tabs/ProjectSettingsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectSettingsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectSettingsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
