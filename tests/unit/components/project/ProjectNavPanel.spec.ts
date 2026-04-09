import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectNavPanel from '@/components/project/ProjectNavPanel.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectNavPanel.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectNavPanel, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
