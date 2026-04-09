import { lpiMount } from '@/../tests/helpers/LpiMount'
import TeamResultList from '@/components/people/ProjectTeamDrawer/TeamResultList.vue'

import { describe, expect, it } from 'vitest'

describe('TeamResultList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TeamResultList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
