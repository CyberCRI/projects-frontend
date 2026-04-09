import { lpiMount } from '@/../tests/helpers/LpiMount'
import ListPaginator from '@/components/base/navigation/ListPaginator.vue'

import { describe, expect, it } from 'vitest'

describe('ListPaginator.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ListPaginator, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
