import { lpiMount } from '@/../tests/helpers/LpiMount'
import AdminNavPanel from '@/components/admin/AdminNavPanel.vue'

import { describe, expect, it } from 'vitest'

describe('AdminNavPanel.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AdminNavPanel, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
