import GoalSummaryItem from '~/components/project/goal/GoalSummaryItem.vue'
import { TranslatedGoalFactory } from '~~/tests/factories/goal.factory'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('GoalSummaryItem.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(GoalSummaryItem, {
      props: {
        goal: TranslatedGoalFactory.generate(),
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should have status icon visible', () => {
    const wrapper = lpiMount(GoalSummaryItem, {
      props: {
        goal: TranslatedGoalFactory.generate({ status: 'complete' }),
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should not have status icon visible', () => {
    const wrapper = lpiMount(GoalSummaryItem, {
      props: {
        goal: TranslatedGoalFactory.generate({ status: 'na' }),
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
