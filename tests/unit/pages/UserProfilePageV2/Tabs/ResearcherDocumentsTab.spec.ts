import ResearcherDocumentsTab from '~/pages/UserProfilePageV2/Tabs/ResearcherDocumentsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { DocumentFactory, ResearcherFactory } from '~~/tests/factories/researcher.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
            ConferenceAbstract: 10,
            ScholarlyPublication: 45,
            Book: 10,
          },
          years: [
            { year: 2025, total: 10 },
            { year: 2024, total: 3 },
            { year: 2023, total: 13 },
            { year: 2022, total: 130 },
          ],
          roles: {
            trc: 12,
            trl: 19,
            tyg: 10,
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
