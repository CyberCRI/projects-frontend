import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLocationDrawer from '@/components/project/map/ProjectLocationDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectLocationDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectLocationDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
