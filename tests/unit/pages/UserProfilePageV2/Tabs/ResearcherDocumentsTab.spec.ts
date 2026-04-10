import { lpiMount, lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import ResearcherDocumentsTab from '@/pages/UserProfilePageV2/Tabs/ResearcherDocumentsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { DocumentFactory, ResearcherFactory } from '../../../../factories/researcher.factory'
import { UserFactory } from '../../../../factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../factories/paginations.factory'

describe('ResearcherDocumentsTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate({
      researcher: ResearcherFactory.generate(),
    })
    const props = {
      user,
      docType: 'publications',
    }
    const organizationCode = useOrganizationCode()

    registerEndpoint(
      `crisalid/organization/${organizationCode}/researcher/${props.user.researcher.id}/${props.docType}/analytics/`,
      () => {
        return {
          document_types: {
            JournalArticle: 100,
            Editorial: 10,
            Lecture: 45,
            Map: 10,
          },
          years: [
            { year: 2025, total: 10 },
            { year: 2024, total: 3 },
            { year: 2023, total: 13 },
            { year: 2022, total: 130 },
          ],
          roles: {
            'thesis-advisor': 12,
            transcriber: 19,
            translator: 10,
          },
        }
      }
    )

    const docWithoutSimilars = DocumentFactory.generate({
      document_type: 'JournalArticle',
      similars: 0,
    })

    registerEndpoint(
      `crisalid/organization/${organizationCode}/researcher/${props.user.researcher.id}/${props.docType}/`,
      () => {
        return PaginationsFactory.generate({
          results: [docWithoutSimilars],
        })
      }
    )

    const wrapper = await lpiMountSuspended(ResearcherDocumentsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
