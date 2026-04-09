import { lpiMount } from '@/../tests/helpers/LpiMount'
import AdminListItem from '@/components/admin/AdminListItem.vue'

import { describe, expect, it } from 'vitest'

describe('AdminListItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AdminListItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
