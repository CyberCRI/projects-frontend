import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupUserSelection from '@/components/people/GroupTeamDrawer/GroupUserSelection.vue'

import { describe, expect, it } from 'vitest'

describe('GroupUserSelection.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupUserSelection, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
