import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupRecapPreview from '@/components/group/Modules/Extras/GroupRecapPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupRecapPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupRecapPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
