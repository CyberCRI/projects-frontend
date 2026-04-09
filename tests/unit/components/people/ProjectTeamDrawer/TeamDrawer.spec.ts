import { lpiMount } from '@/../tests/helpers/LpiMount'
import TeamDrawer from '@/components/people/ProjectTeamDrawer/TeamDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('TeamDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TeamDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
