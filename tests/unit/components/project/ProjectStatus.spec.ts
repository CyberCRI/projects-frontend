import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectStatus from '@/components/project/ProjectStatus.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectStatus.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectStatus, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
