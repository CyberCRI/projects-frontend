import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectGoalsTab from '@/pages/ProjectPageV2/Tabs/ProjectGoalsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectGoalsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectGoalsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
