import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectAnnouncementsTab from '@/pages/ProjectPageV2/Tabs/ProjectAnnouncementsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectAnnouncementsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectAnnouncementsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
