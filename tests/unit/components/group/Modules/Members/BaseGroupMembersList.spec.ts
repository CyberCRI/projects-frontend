import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'

import { describe, expect, it } from 'vitest'

describe('BaseGroupMembersList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseGroupMembersList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
