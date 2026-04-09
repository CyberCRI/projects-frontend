import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillItemFull from '@/components/people/skill/SkillItemFull.vue'

import { describe, expect, it } from 'vitest'

describe('SkillItemFull.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkillItemFull, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
