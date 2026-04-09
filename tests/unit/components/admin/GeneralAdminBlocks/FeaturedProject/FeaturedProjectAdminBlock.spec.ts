import { lpiMount } from '@/../tests/helpers/LpiMount'
import FeaturedProjectAdminBlock from '@/components/admin/GeneralAdminBlocks/FeaturedProject/FeaturedProjectAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('FeaturedProjectAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(FeaturedProjectAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
