import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectEditDescriptionTab from '@/pages/ProjectPageV2/Tabs/ProjectEditDescriptionTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectEditDescriptionTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectEditDescriptionTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
