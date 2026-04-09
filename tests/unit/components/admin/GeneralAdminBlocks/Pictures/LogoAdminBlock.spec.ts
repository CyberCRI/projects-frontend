import { lpiMount } from '@/../tests/helpers/LpiMount'
import LogoAdminBlock from '@/components/admin/GeneralAdminBlocks/Pictures/LogoAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('LogoAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LogoAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
