import { lpiMount } from '@/../tests/helpers/LpiMount'
import RoleSelection from '@/components/people/ProjectTeamDrawer/RoleSelection.vue'

import { describe, expect, it } from 'vitest'

describe('RoleSelection.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(RoleSelection, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
