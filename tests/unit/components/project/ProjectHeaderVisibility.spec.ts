import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectHeaderVisibility from '@/components/project/ProjectHeaderVisibility.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectHeaderVisibility.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectHeaderVisibility, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
