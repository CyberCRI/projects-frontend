import { lpiMount } from '@/../tests/helpers/LpiMount'
import GoalOrSdgsDrawer from '@/components/project/sdg/GoalOrSdgsDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('GoalOrSdgsDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GoalOrSdgsDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
