import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupEventPreview from '@/components/group/Modules/Event/GroupEventPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupEventPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupEventPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
