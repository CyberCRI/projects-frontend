import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectCommentsTab from '@/pages/ProjectPageV2/Tabs/ProjectCommentsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectCommentsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectCommentsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
