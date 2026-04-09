import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupSimilarDrawer from '@/components/group/Modules/Extras/GroupSimilarDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('GroupSimilarDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupSimilarDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
