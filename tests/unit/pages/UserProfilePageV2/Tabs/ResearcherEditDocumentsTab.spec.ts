import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResearcherEditDocumentsTab from '@/pages/UserProfilePageV2/Tabs/ResearcherEditDocumentsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ResearcherEditDocumentsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResearcherEditDocumentsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
