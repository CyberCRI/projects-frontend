import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectDescriptionTab from '@/pages/ProjectPageV2/Tabs/ProjectDescriptionTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectDescriptionTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectDescriptionTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
