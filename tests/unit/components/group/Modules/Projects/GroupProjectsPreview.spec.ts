import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupProjectsPreview from '@/components/group/Modules/Projects/GroupProjectsPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupProjectsPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupProjectsPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
