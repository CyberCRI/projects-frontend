import { lpiMount } from '@/../tests/helpers/LpiMount'
import OrgWordingDrawer from '@/components/admin/GeneralAdminBlocks/Wording/OrgWordingDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('OrgWordingDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OrgWordingDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
