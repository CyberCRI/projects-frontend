import { lpiMount } from '@/../tests/helpers/LpiMount'
import ChooseFollowedProjectsDrawer from '@/components/project/ChooseFollowedProjectsDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ChooseFollowedProjectsDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ChooseFollowedProjectsDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
