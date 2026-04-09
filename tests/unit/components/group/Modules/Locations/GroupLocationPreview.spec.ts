import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupLocationPreview from '@/components/group/Modules/Locations/GroupLocationPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupLocationPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupLocationPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
