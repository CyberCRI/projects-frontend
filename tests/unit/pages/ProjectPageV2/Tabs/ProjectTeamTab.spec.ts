import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectTeamTab from '@/pages/ProjectPageV2/Tabs/ProjectTeamTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectTeamTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectTeamTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
