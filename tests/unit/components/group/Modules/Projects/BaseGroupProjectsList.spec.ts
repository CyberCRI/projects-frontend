import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseGroupProjectsList from '@/components/group/Modules/Projects/BaseGroupProjectsList.vue'

import { describe, expect, it } from 'vitest'

describe('BaseGroupProjectsList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseGroupProjectsList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
