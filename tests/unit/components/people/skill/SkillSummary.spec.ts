import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillSummary from '@/components/people/skill/SkillSummary.vue'

import { describe, expect, it } from 'vitest'

describe('SkillSummary.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkillSummary, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
