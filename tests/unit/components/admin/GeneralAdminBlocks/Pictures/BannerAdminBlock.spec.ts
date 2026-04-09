import { lpiMount } from '@/../tests/helpers/LpiMount'
import BannerAdminBlock from '@/components/admin/GeneralAdminBlocks/Pictures/BannerAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('BannerAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BannerAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
