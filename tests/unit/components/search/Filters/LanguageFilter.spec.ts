import { lpiMount } from '@/../tests/helpers/LpiMount'
import LanguageFilter from '@/components/search/Filters/LanguageFilter.vue'

import { describe, expect, it } from 'vitest'

describe('LanguageFilter.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LanguageFilter, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
