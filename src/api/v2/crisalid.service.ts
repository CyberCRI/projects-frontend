import type {
  PeopleGroupIdOrSlug,
  OrganizationModel,
  ResearcherDocument,
  ResearcherDocumentType,
  Researcher,
} from 'shared-projects-frontend/models'

import type { RefOrRaw } from '~/interfaces/utils'

import {
  getGroupResearchDocument as fetchGroupResearchDocument,
  getGroupResearchDocumentAnalytics as fetchGroupResearchDocumentAnalytics,
  getUserResearchDocument as fetchUserResearchDocument,
  getUserResearchDocumentAnalytics as fetchUserResearchDocumentAnalytics,
  getResearchDocumentSimilars as fetchResearchDocumentSimilars,
} from 'shared-projects-frontend/apis'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import useAsyncPaginationAPI from '~/composables/useAsyncPaginationAPI'
import useAsyncAPI from '~/composables/useAsyncAPI'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig
type ConfigPagination = UseAsyncPaginationApiConfig

export const getUserResearchDocument = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<Researcher['id']>,
  documenType: ResearcherDocumentType,
  config: ConfigPagination = {}
) => {
  const { translateResearcherDocuments } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::${documenType}`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchUserResearchDocument(unref(organizationCode), unref(researcherId), unref(documenType), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateResearcherDocuments(data),
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}

export const getGroupResearchDocument = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  documenType: ResearcherDocumentType,
  config: ConfigPagination = {}
) => {
  const { translateResearcherDocuments } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::group::${unref(groupId)}::${documenType}`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchGroupResearchDocument(unref(organizationCode), unref(groupId), unref(documenType), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateResearcherDocuments(data),
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getUserResearchDocumentAnalytics = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<Researcher['id']>,
  documenType: ResearcherDocumentType,
  config: Config = {}
) => {
  const key = computed(
    () =>
      `${unref(organizationCode)}::researcher::${unref(researcherId)}::${documenType}::analytics`
  )

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchUserResearchDocumentAnalytics(
        unref(organizationCode),
        unref(researcherId),
        unref(documenType),
        {
          ...DEFAULT_CONFIG,
          ...config,
        }
      ),
    {
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}

export const getGroupResearchDocumentAnalytics = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  groupId: RefOrRaw<PeopleGroupIdOrSlug>,
  documenType: ResearcherDocumentType,
  config: Config = {}
) => {
  const key = computed(
    () => `${unref(organizationCode)}::group::${unref(groupId)}::${documenType}::analytics`
  )

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchGroupResearchDocumentAnalytics(
        unref(organizationCode),
        unref(groupId),
        unref(documenType),
        {
          ...DEFAULT_CONFIG,
          ...config,
        }
      ),
    {
      watch: onlyRefs([organizationCode, groupId]),
      ...config,
    }
  )
}

export const getResearchDocumentSimilars = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  documentId: RefOrRaw<ResearcherDocument['id']>,
  config: ConfigPagination = {}
) => {
  const { translateResearcherDocuments } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::crisalid::document::${unref(documentId)}::similars`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearchDocumentSimilars(unref(organizationCode), unref(documentId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateResearcherDocuments(data),
      watch: onlyRefs([organizationCode, documentId]),
      checkArgs: true,
      ...config,
    }
  )
}
