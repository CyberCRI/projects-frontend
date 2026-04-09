import { lpiMount } from '@/../tests/helpers/LpiMount'
import MarkerSuggestion from '@/components/map/MarkerSuggestion.vue'

import { describe, expect, it } from 'vitest'

describe('MarkerSuggestion.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(MarkerSuggestion, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
