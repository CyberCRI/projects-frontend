import GroupDocumentsTab from '~/pages/GroupPageV2/Tabs/Documents/GroupDocumentsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { DocumentType, ResearcherDocumentAnalytics } from '~/interfaces/researcher'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { documentAnalyticsSkeleton } from '~/skeletons/crisalid.skeletons'
import { DocumentFactory } from '~~/tests/factories/researcher.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

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
