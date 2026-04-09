import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseGroupEventList from '@/components/group/Modules/Event/BaseGroupEventList.vue'

import { describe, expect, it } from 'vitest'

describe('BaseGroupEventList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseGroupEventList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
