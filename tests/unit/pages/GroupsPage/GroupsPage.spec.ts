import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupsPage from '@/pages/GroupsPage/GroupsPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('GroupsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(GroupsPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
