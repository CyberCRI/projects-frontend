import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectResourcesTab from '@/pages/ProjectPageV2/Tabs/ProjectResourcesTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectResourcesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectResourcesTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
