import { lpiMount } from '@/../tests/helpers/LpiMount'
import AccordionItem from '@/components/base/AccordionItem.vue'

import { describe, expect, it } from 'vitest'

describe('AccordionItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AccordionItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
