import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectDrawer from '@/components/project/ProjectDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
