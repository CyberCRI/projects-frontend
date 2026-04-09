import { lpiMount } from '@/../tests/helpers/LpiMount'
import OwnResearcherDocumentsList from '@/components/people/Researcher/OwnResearcherDocumentsList.vue'

import { describe, expect, it } from 'vitest'

describe('OwnResearcherDocumentsList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OwnResearcherDocumentsList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
