import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResearcherDocumentsTab from '@/pages/UserProfilePageV2/Tabs/ResearcherDocumentsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ResearcherDocumentsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ResearcherDocumentsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
