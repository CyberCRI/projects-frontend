import {
  getOwnResearchDocument as fetchOwnResearchDocument,
  getGroupResearchDocument as fetchGroupResearchDocument,
  getResearchDocumentSimilars as fetchResearchDocumentSimilars,
  getOwnResearchDocumentAnalytics as fetchOwnResearchDocumentAnalytics,
  getGroupResearchDocumentAnalytics as fetchGroupResearchDocumentAnalytics,
} from '@/api/crisalid.service'
import useAsyncAPI from '@/composables/useAsyncAPI'
import useAsyncPaginationAPI from '@/composables/useAsyncPaginationAPI'
import { onlyRefs } from '@/functs/onlyRefs'
import { Document, DocumentType, Researcher } from '@/interfaces/researcher'
import { RefOrRaw } from '@/interfaces/utils'
import { GroupModel } from '@/models/group.model'
import { PeopleGroupModel } from '@/models/invitation.model'
import { OrganizationModel } from '@/models/organization.model'

const DEFAULT_CONFIG = {}

export const getOwnResearchDocument = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<Researcher['id']>,
  documenType: DocumentType,
  config = {}
) => {
  const { translateResearcherDocuments } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::researcher::${unref(researcherId)}::${documenType}`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchOwnResearchDocument(unref(organizationCode), unref(researcherId), unref(documenType), {
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
  groupId: RefOrRaw<PeopleGroupModel['id']>,
  documenType: DocumentType,
  config = {}
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

export const getOwnResearchDocumentAnalytics = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  researcherId: RefOrRaw<Researcher['id']>,
  documenType: DocumentType,
  config = {}
) => {
  const key = computed(
    () =>
      `${unref(organizationCode)}::researcher::${unref(researcherId)}::${documenType}::analytics`
  )

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchOwnResearchDocumentAnalytics(
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
  groupId: RefOrRaw<GroupModel['id']>,
  documenType: DocumentType,
  config = {}
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
  documentId: RefOrRaw<Document['id']>,
  config = {}
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
