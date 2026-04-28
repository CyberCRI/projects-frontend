import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import GroupDocumentsTab from '~/pages/GroupPageV2/Tabs/Documents/GroupDocumentsTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { TranslatedProjectFactory } from '../../../../../factories/project.factory'
import { DocumentType, ResearcherDocumentAnalytics } from '~/interfaces/researcher'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../../factories/paginations.factory'
import { DocumentFactory } from '../../../../../factories/researcher.factory'
import { documentAnalyticsSkeleton } from '~/skeletons/crisalid.skeletons'

describe('GroupDocumentsTab.vue', () => {
  it('should render component', async () => {
    const group = TranslatedProjectFactory.generate()
    const documentType: DocumentType = 'publications'
    const props = { group, documentType }

    const organisationCode = useOrganizationCode()

    registerEndpoint(
      `crisalid/organization/${organisationCode}/people-group/${group.id}/${documentType}/analytics/`,
      () => {
        return documentAnalyticsSkeleton() satisfies ResearcherDocumentAnalytics
      }
    )

    registerEndpoint(
      `crisalid/organization/${organisationCode}/people-group/${group.id}/${documentType}/`,
      () => {
        return PaginationsFactory.generate({ results: DocumentFactory.generateMany(10) })
      }
    )

    const wrapper = await lpiMountSuspended(GroupDocumentsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
