import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditChatDrawer from '@/components/admin/GeneralAdminBlocks/Chat/EditChatDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('EditChatDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditChatDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
