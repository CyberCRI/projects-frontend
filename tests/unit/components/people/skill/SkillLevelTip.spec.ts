import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'

import { describe, expect, it } from 'vitest'

describe('SkillLevelTip.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkillLevelTip, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
