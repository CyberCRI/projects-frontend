import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResearcherDocumentSimilars from '@/components/people/Researcher/ResearcherDocumentSimilars.vue'

import { describe, expect, it } from 'vitest'

describe('ResearcherDocumentSimilars.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResearcherDocumentSimilars, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
