import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupProjectsTab from '@/pages/GroupPageV2/Tabs/Projects/GroupProjectsTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupProjectsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupProjectsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
