import { lpiMount } from '@/../tests/helpers/LpiMount'
import GoalItem from '@/components/project/goal/GoalItem.vue'

import { describe, expect, it } from 'vitest'

describe('GoalItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GoalItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
