import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectSummaryBlock from '@/components/home/SummaryCards/ProjectSummaryBlock.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectSummaryBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectSummaryBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
