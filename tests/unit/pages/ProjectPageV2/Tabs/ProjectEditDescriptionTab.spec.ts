import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectEditDescriptionTab from '@/pages/ProjectPageV2/Tabs/ProjectEditDescriptionTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectEditDescriptionTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectEditDescriptionTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
