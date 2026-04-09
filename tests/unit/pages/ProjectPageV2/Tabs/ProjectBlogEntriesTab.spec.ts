import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectBlogEntriesTab from '@/pages/ProjectPageV2/Tabs/ProjectBlogEntriesTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectBlogEntriesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectBlogEntriesTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
