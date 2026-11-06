import type {
  PeopleGroupIdOrSlug,
  OrganizationModel,
  ResearcherDocument,
  ResearcherDocumentType,
  Researcher,
  QueryFilterDocument,
  QueryFilterAward,
  UserModel,
  QueryFilterPatent,
  QueryFilterFunding,
  QueryFilterTeaching,
} from 'shared-projects-frontend/models'

import type { RefOrRaw } from '~/interfaces/utils'

import {
  getGroupResearchDocument as fetchGroupResearchDocument,
  getGroupResearchDocumentAnalytics as fetchGroupResearchDocumentAnalytics,
  getUserResearchDocument as fetchUserResearchDocument,
  getUserResearchDocumentAnalytics as fetchUserResearchDocumentAnalytics,
  getResearchDocumentSimilars as fetchResearchDocumentSimilars,
  getResearcherAffiliated as fetchResearcherAffiliated,
  getResearcherSimilars as fetchResearcherSimilars,
  getResearcherPatents as fetchResearcherPatent,
  getResearcherAwards as fetchResearcherAward,
  getResearcherTeachings as fetchResearcherTeachings,
  getResearcherFundings as fetchResearcherFundings,
  getResearcherStructures as fetchResearcherStructures,
} from 'shared-projects-frontend/apis'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import useAsyncPaginationAPI from '~/composables/useAsyncPaginationAPI'
import useAsyncAPI from '~/composables/useAsyncAPI'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterDocument>
type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterDocument>

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

export const getResearchAffiliated = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<Researcher['id']>,
  config: ConfigPagination = {}
) => {
  const { translateResearchers } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::affiliated`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearcherAffiliated(unref(organizationCode), unref(researcherId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateResearchers(data),
      watch: onlyRefs([organizationCode, researcherId]),
      checkArgs: true,
      ...config,
    }
  )
}

export const getResearcherSimilars = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<Researcher['id']>,
  config: UseAsyncPaginationApiConfig = {}
) => {
  const { translateResearchers } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::similars`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearcherSimilars(unref(organizationCode), unref(researcherId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateResearchers(data),
      watch: onlyRefs([organizationCode, researcherId]),
      checkArgs: true,
      ...config,
    }
  )
}

export const getResearcherAwards = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterAward> = {}
) => {
  const { translateResearcherAwards } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::awards`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearcherAward(unref(organizationCode), unref(researcherId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateResearcherAwards(data),
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}

export const getResearcherPatents = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterPatent> = {}
) => {
  const { translatePatents } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::patents`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearcherPatent(unref(organizationCode), unref(researcherId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translatePatents(data),
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}

export const getResearcherFundings = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterFunding> = {}
) => {
  const { translateFundings } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::fundings`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearcherFundings(unref(organizationCode), unref(researcherId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateFundings(data),
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}

export const getResearcherTeachings = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterTeaching> = {}
) => {
  const { translateTeachings } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::teachings`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearcherTeachings(unref(organizationCode), unref(researcherId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateTeachings(data),
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}

export const getResearcherStructures = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig = {}
) => {
  const { translateResearcherStructures } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::structures`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchResearcherStructures(unref(organizationCode), unref(researcherId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateResearcherStructures(data),
      watch: onlyRefs([organizationCode, researcherId]),
      ...config,
    }
  )
}


// structures

export const getStructureAwards = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  structureId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterAward> = {}
) => {
  console.log('TODO: getStructureAwards', organizationCode, structureId, config)
}

export const getStructureFundings = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  structureId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterAward> = {}
) => {
  console.log('TODO: getStructureFundings', organizationCode, structureId, config)
}

export const getStructureSimilars = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  structureId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterAward> = {}
) => {
  console.log('TODO: getStructureSimilars', organizationCode, structureId, config)
}

export const getStructureTeachings = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  structureId: RefOrRaw<UserModel['id']>,
  config: UseAsyncPaginationApiConfig<QueryFilterAward> = {}
) => {
  console.log('TODO: getStructureTeachings', organizationCode, structureId, config)
}
