import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLine from '@/components/home/SummaryCards/ProjectLine.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectLine.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectLine, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
