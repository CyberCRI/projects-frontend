import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserSkillsFull from '@/components/people/skill/UserSkillsFull.vue'

import { describe, expect, it } from 'vitest'

describe('UserSkillsFull.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserSkillsFull, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
