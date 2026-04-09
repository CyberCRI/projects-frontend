import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupNewsPreview from '@/components/group/Modules/News/GroupNewsPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupNewsPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupNewsPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
