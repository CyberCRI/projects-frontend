import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectMemberItem from '@/components/people/ProjectMemberItem/ProjectMemberItem.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectMemberItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectMemberItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
