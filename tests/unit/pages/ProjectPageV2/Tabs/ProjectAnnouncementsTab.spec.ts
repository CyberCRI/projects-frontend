import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectAnnouncementsTab from '@/pages/ProjectPageV2/Tabs/ProjectAnnouncementsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectAnnouncementsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectAnnouncementsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
