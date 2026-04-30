import GoalsRecap from '~/components/project/goal/GoalsRecap.vue'
import { GoalFactory } from '~~/tests/factories/goal.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('GoalRecap.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(GoalsRecap, {
      props: {
        goals: GoalFactory.generateMany(3),
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
