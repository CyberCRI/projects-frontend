import { lpiMount } from '@/../tests/helpers/LpiMount'
import ChatAdminBlock from '@/components/admin/GeneralAdminBlocks/Chat/ChatAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('ChatAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ChatAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
