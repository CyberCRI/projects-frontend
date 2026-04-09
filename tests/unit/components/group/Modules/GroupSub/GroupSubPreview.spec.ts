import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupSubPreview from '@/components/group/Modules/GroupSub/GroupSubPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupSubPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupSubPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
