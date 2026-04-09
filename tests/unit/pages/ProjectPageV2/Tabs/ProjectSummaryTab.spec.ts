import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectSummaryTab from '@/pages/ProjectPageV2/Tabs/ProjectSummaryTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectSummaryTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectSummaryTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
