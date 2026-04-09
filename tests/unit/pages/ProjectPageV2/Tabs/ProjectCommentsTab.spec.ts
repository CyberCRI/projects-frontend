import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectCommentsTab from '@/pages/ProjectPageV2/Tabs/ProjectCommentsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectCommentsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectCommentsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
