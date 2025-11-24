import { lpiMount } from '@/../tests/helpers/LpiMount'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import ResearcherDocumentsTab from '@/pages/UserProfilePageV2/Tabs/ResearcherDocumentsTab.vue'
import { UserFactory } from '../../../../factories/user.factory'
import { delay } from 'es-toolkit'
import { DocumentFactory, ResearcherFactory } from '../../../../factories/researcher.factory'
import { PaginationsFactory } from '../../../../factories/paginations.factory'

describe('ResearcherDocumentsTab.vue', () => {
  let defaultProps

  beforeAll(() => {
    defaultProps = {
      user: UserFactory.generate(),
      docType: 'publications',
    }

    vi.mock('#imports', () => ({
      useRuntimeConfig: () => ({
        public: {
          appApiUrl: '',
          APP_KEYCLOAK_URL: 'https://keycloak.tech',
          APP_KEYCLOAK_REALM: 'RealmName',
          APP_KEYCLOAK_CLIENT_ID: 'RealmId',
          APP_KEYCLOAK_CLIENT_SECRET: 'ClientSecret',
          APP_API_URL: '',
          APP_API_DEFAULT_VERSION: '',
        },
      }),
    }))
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

    registerEndpoint(`crisalid/researcher/${defaultProps.user.researcher.id}/publications/`, () => {
      throw createError({ statusCode: 500 })
    })

    const wrapper = await lpiMount(ResearcherDocumentsTab, { props: defaultProps })
    expect(wrapper.find('.loading').exists()).toBeTruthy()
    await delay(100)
    expect(wrapper.find('.loading').exists()).toBeFalsy()
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
      `crisalid/researcher/${defaultProps.user.researcher.id}/publications/analytics/`,
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

    const doc = DocumentFactory.generate({ document_type: 'JournalArticle' })
    registerEndpoint(
      `crisalid/researcher/${defaultProps.user.researcher.id}/publications/${doc.id}/similars/`,
      () => {
        return PaginationsFactory.generate({
          results: [
            DocumentFactory.generate({ document_type: 'JournalArticle' }),
            DocumentFactory.generate({ document_type: 'JournalArticle' }),
          ],
        })
      }
    )

    registerEndpoint(`crisalid/researcher/${defaultProps.user.researcher.id}/publications/`, () => {
      return PaginationsFactory.generate({
        results: [
          doc,
          DocumentFactory.generate({ document_type: 'JournalArticle' }),
          DocumentFactory.generate({ document_type: 'JournalArticle' }),
        ],
      })
    })

    const wrapper = await lpiMount(ResearcherDocumentsTab, { props: defaultProps })
    expect(wrapper.find('.loading').exists()).toBeTruthy()
    await delay(100)
    expect(wrapper.find('.loading').exists()).toBeFalsy()

    expect(wrapper.find('.documents-list').element.childElementCount).toEqual(3)
    wrapper.find(`[data-test="see-more-${doc.id}"]`).element.dispatchEvent(new Event('click'))
    await delay(100)
    expect(wrapper.find('.documents-list-similars').element.childElementCount).toEqual(2)
  })
})
