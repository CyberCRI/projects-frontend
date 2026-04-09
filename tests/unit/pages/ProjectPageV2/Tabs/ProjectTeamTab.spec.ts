import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectTeamTab from '@/pages/ProjectPageV2/Tabs/ProjectTeamTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectTeamTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectTeamTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
