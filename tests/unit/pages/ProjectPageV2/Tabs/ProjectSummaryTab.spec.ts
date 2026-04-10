import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectSummaryTab from '@/pages/ProjectPageV2/Tabs/ProjectSummaryTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectSummaryTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectSummaryTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
