import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillItem from '@/components/people/skill/SkillItem.vue'

import { describe, expect, it } from 'vitest'

describe('SkillItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkillItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
