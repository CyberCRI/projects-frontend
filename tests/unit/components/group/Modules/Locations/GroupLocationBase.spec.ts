import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'

import { describe, expect, it } from 'vitest'

describe('GroupLocationBase.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupLocationBase, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
