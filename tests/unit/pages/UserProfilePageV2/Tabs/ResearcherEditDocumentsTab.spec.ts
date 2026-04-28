import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ResearcherEditDocumentsTab from '~/pages/UserProfilePageV2/Tabs/ResearcherEditDocumentsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ResearcherEditDocumentsTab.vue', () => {
  it('should render component', async () => {
    const props = { docType: 'publication' }

    const wrapper = await lpiMountSuspended(ResearcherEditDocumentsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
