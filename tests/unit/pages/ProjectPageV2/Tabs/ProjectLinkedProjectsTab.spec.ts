import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLinkedProjectsTab from '@/pages/ProjectPageV2/Tabs/ProjectLinkedProjectsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectLinkedProjectsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectLinkedProjectsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
