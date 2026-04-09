import { lpiMount } from '@/../tests/helpers/LpiMount'
import TagsDrawer from '@/components/tags/TagsDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('TagsDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TagsDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
