import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResearcherDocument from '@/components/people/Researcher/ResearcherDocument.vue'

import { describe, expect, it } from 'vitest'

describe('ResearcherDocument.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResearcherDocument, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
