import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectResourcesTab from '@/pages/ProjectPageV2/Tabs/ProjectResourcesTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectResourcesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectResourcesTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
