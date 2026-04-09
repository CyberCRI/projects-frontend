import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResearcherDocumentsListBase from '@/components/people/Researcher/ResearcherDocumentsListBase.vue'

import { describe, expect, it } from 'vitest'

describe('ResearcherDocumentsListBase.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResearcherDocumentsListBase, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
