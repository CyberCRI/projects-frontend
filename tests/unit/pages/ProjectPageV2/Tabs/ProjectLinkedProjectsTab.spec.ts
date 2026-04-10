import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLinkedProjectsTab from '@/pages/ProjectPageV2/Tabs/ProjectLinkedProjectsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectLinkedProjectsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectLinkedProjectsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
