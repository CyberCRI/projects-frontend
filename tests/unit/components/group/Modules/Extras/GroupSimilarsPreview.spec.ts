import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupSimilarsPreview from '@/components/group/Modules/Extras/GroupSimilarsPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupSimilarsPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupSimilarsPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
