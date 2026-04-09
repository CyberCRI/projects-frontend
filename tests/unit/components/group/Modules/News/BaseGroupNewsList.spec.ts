import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'

import { describe, expect, it } from 'vitest'

describe('BaseGroupNewsList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseGroupNewsList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
