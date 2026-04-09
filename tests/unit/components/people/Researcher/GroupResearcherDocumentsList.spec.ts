import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupResearcherDocumentsList from '@/components/people/Researcher/GroupResearcherDocumentsList.vue'

import { describe, expect, it } from 'vitest'

describe('GroupResearcherDocumentsList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupResearcherDocumentsList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
