import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectFollowIcon from '@/components/project/ProjectFollowIcon.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectFollowIcon.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectFollowIcon, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
