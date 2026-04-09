import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupsPage from '@/pages/GroupsPage/GroupsPage.vue'

import { describe, expect, it } from 'vitest'

describe('GroupsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupsPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
