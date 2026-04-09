import { lpiMount } from '@/../tests/helpers/LpiMount'
import SearchBlock from '@/components/search/SearchOptions/SearchBlock.vue'

import { describe, expect, it } from 'vitest'

describe('SearchBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SearchBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
