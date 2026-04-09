import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectSdgsDrawer from '@/components/project/sdg/ProjectSdgsDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectSdgsDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectSdgsDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
