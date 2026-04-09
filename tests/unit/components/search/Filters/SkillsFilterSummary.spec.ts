import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillsFilterSummary from '@/components/search/Filters/SkillsFilterSummary.vue'

import { describe, expect, it } from 'vitest'

describe('SkillsFilterSummary.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkillsFilterSummary, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
