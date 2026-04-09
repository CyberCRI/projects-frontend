import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupDescriptionPreview from '@/components/group/Modules/Extras/GroupDescriptionPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupDescriptionPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupDescriptionPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
