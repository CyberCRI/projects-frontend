import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResearcherDocumentsTab from '@/pages/UserProfilePageV2/Tabs/ResearcherDocumentsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ResearcherDocumentsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResearcherDocumentsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
