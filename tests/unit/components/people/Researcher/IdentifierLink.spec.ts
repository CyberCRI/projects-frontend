import { lpiMount } from '@/../tests/helpers/LpiMount'
import IdentifierLink from '@/components/people/Researcher/IdentifierLink.vue'

import { describe, expect, it } from 'vitest'

describe('IdentifierLink.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(IdentifierLink, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
