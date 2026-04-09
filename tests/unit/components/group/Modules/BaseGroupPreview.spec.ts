import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'

import { describe, expect, it } from 'vitest'

describe('BaseGroupPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseGroupPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
