import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectGoalsTab from '@/pages/ProjectPageV2/Tabs/ProjectGoalsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectGoalsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectGoalsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
