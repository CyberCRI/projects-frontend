import { lpiMount } from '@/../tests/helpers/LpiMount'
import HeaderItemList from '@/components/base/navigation/HeaderItemList.vue'

import { describe, expect, it } from 'vitest'

describe('HeaderItemList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HeaderItemList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
