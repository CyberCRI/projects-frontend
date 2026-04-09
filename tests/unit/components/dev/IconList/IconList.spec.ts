import { lpiMount } from '@/../tests/helpers/LpiMount'
import IconList from '@/components/dev/IconList/IconList.vue'

import { describe, expect, it } from 'vitest'

describe('IconList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(IconList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
