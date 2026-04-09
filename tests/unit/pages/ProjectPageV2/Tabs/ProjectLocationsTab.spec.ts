import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLocationsTab from '@/pages/ProjectPageV2/Tabs/ProjectLocationsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectLocationsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectLocationsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
