import { lpiMount } from '@/../tests/helpers/LpiMount'
import DescriptionSummaryBlock from '@/components/project/description/DescriptionSummaryBlock.vue'

import { describe, expect, it } from 'vitest'

describe('DescriptionSummaryBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DescriptionSummaryBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
