import ResearcherEditDocumentsTab from '~/pages/UserProfilePageV2/Tabs/ResearcherEditDocumentsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import type { ResearcherDocumentType } from 'shared-projects-frontend/models'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ResearcherEditDocumentsTab.vue', () => {
  it('should render component', async () => {
    const props = {
      documentType: 'publications' satisfies ResearcherDocumentType as ResearcherDocumentType,
    }

    const wrapper = await lpiMountSuspended(ResearcherEditDocumentsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
