import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserSelection from '@/components/people/ProjectTeamDrawer/UserSelection.vue'

import { describe, expect, it } from 'vitest'

describe('UserSelection.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserSelection, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
