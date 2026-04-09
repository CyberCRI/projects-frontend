import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupProjectsEditTab from '@/pages/GroupPageV2/Tabs/Projects/GroupProjectsEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupProjectsEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupProjectsEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
