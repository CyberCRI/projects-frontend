import { lpiMount } from '@/../tests/helpers/LpiMount'
import { beforeAll, describe, expect, it } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import ResearcherDocumentsTab from '@/pages/UserProfilePageV2/Tabs/ResearcherDocumentsTab.vue'
import { UserFactory } from '../../../../factories/user.factory'
import { delay } from 'es-toolkit'
import { DocumentFactory, ResearcherFactory } from '../../../../factories/researcher.factory'
import { PaginationsFactory } from '../../../../factories/paginations.factory'
import { flushPromises } from '@vue/test-utils'

describe('ResearcherDocumentsTab.vue', () => {
  let defaultProps
  const orgaCode = useOrganizationCode()

  beforeAll(() => {
    defaultProps = {
      user: UserFactory.generate(),
      docType: 'publications',
    }
  })

  it('undefined researcher', async () => {
    defaultProps.researcher = null
    const wrapper = await lpiMount(ResearcherDocumentsTab, { props: defaultProps })
    expect(wrapper.find('.document-tab-empty').exists()).toBeTruthy()
  })

  it('empty publications', async () => {
    defaultProps.user.researcher = {
      ...ResearcherFactory.generate(),
      documents: {
        publications: 0,
      },
    }
    const wrapper = await lpiMount(ResearcherDocumentsTab, { props: defaultProps })
    expect(wrapper.find('.document-tab-empty').exists()).toBeTruthy()
  })

  it('publications errors', async () => {
    defaultProps.user.researcher = {
      ...ResearcherFactory.generate(),
      documents: {
        publications: 100,
      },
    }

    registerEndpoint(
      `crisalid/organization/${orgaCode}/researcher/${defaultProps.user.researcher.id}/publications/`,
      () => {
        throw createError({ statusCode: 500 })
      }
    )

    const wrapper = await lpiMount(ResearcherDocumentsTab, { props: defaultProps })
    expect(wrapper.find('.skeletons').exists()).toBeTruthy()
    await delay(100)
    expect(wrapper.find('.skeletons').exists()).toBeFalsy()
    expect(wrapper.find('.error').exists()).toBeTruthy()
  })

  it('publications', async () => {
    defaultProps.user.researcher = {
      ...ResearcherFactory.generate(),
      documents: {
        publications: 100,
      },
    }
    registerEndpoint(
      `crisalid/organization/${orgaCode}/researcher/${defaultProps.user.researcher.id}/publications/analytics/`,
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

    const docWithSimilars = DocumentFactory.generate({
      document_type: 'JournalArticle',
      similars: 6,
    })
    const docWithoutSimilars = DocumentFactory.generate({
      document_type: 'JournalArticle',
      similars: 0,
    })

    registerEndpoint(
      `crisalid/organization/${orgaCode}/document/${docWithSimilars.id}/similars/`,
      () => {
        return PaginationsFactory.generate({
          results: [
            DocumentFactory.generate({ document_type: 'JournalArticle' }),
            DocumentFactory.generate({ document_type: 'JournalArticle' }),
          ],
        })
      }
    )

    registerEndpoint(
      `crisalid/organization/${orgaCode}/researcher/${defaultProps.user.researcher.id}/publications/`,
      () => {
        return PaginationsFactory.generate({
          results: [docWithSimilars, docWithoutSimilars],
        })
      }
    )

    const wrapper = await lpiMount(ResearcherDocumentsTab, { props: defaultProps })
    expect(wrapper.find('.skeletons').exists()).toBeTruthy()
    await delay(100)
    expect(wrapper.find('.skeletons').exists()).toBeFalsy()

    expect(wrapper.find('.documents-list').element.childElementCount).toEqual(2)
    // no similars button show
    expect(wrapper.find(`[data-test="see-more-${docWithoutSimilars.id}"]`).exists()).toBe(false)

    wrapper
      .find(`[data-test="see-more-${docWithSimilars.id}"]`)
      .element.dispatchEvent(new Event('click'))
    await delay(100)
    await flushPromises()
    expect(wrapper.find('.documents-list-similars').element.childElementCount).toEqual(2)
  })
})
