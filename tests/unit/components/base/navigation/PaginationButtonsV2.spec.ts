import { lpiMount } from '@/../tests/helpers/LpiMount'
import PaginationButtonsV2 from '@/components/base/navigation/PaginationButtonsV2.vue'

import { describe, expect, it } from 'vitest'

describe('PaginationButtonsV2.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PaginationButtonsV2, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
