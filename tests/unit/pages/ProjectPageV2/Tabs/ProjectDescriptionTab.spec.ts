import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectDescriptionTab from '@/pages/ProjectPageV2/Tabs/ProjectDescriptionTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectDescriptionTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectDescriptionTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
