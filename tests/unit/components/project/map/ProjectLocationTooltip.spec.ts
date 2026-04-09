import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLocationTooltip from '@/components/project/map/ProjectLocationTooltip.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectLocationTooltip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectLocationTooltip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
