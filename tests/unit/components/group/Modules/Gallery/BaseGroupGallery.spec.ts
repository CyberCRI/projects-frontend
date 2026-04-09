import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseGroupGallery from '@/components/group/Modules/Gallery/BaseGroupGallery.vue'

import { describe, expect, it } from 'vitest'

describe('BaseGroupGallery.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseGroupGallery, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
