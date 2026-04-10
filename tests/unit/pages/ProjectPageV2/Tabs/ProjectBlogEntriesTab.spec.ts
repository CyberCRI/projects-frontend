import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectBlogEntriesTab from '@/pages/ProjectPageV2/Tabs/ProjectBlogEntriesTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectBlogEntriesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectBlogEntriesTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
