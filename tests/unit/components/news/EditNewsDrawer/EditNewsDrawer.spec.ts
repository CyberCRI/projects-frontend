import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditNewsDrawer from '@/components/news/EditNewsDrawer/EditNewsDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('EditNewsDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditNewsDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
