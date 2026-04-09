import { lpiMount } from '@/../tests/helpers/LpiMount'
import AdminBlock from '@/components/admin/GeneralAdminBlocks/AdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('AdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
