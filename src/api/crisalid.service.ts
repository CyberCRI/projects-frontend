import type { PeopleGroupIdOrSlug } from '~/models/invitation.model'

import type {
  Document,
  DocumentType,
  QueryFilterResearcher,
  Researcher,
  ResearcherDocumentAnalytics,
} from '~/interfaces/researcher'
import type { OrganizationModel } from '~/models/organization.model'

export async function getOwnResearchDocument(
  organisationCode: string,
  researchId: Researcher['id'],
  documentType: DocumentType,
  config = {}
) {
  return await useAPI<PaginationResult<Document>>(
    `crisalid/organization/${organisationCode}/researcher/${researchId}/${documentType}/`,
    config
  )
}

export async function getGroupResearchDocument(
  organisationCode: string,
  groupId: PeopleGroupIdOrSlug,
  documentType: DocumentType,
  config = {}
) {
  return await useAPI<PaginationResult<Document>>(
    `crisalid/organization/${organisationCode}/people-group/${groupId}/${documentType}/`,
    config
  )
}

export async function getOwnResearchDocumentAnalytics(
  organisationCode: string,
  researchId: Researcher['id'],
  documentType: DocumentType,
  config = {}
) {
  return await useAPI<ResearcherDocumentAnalytics>(
    `crisalid/organization/${organisationCode}/researcher/${researchId}/${documentType}/analytics/`,
    config
  )
}

export async function getGroupResearchDocumentAnalytics(
  organisationCode: string,
  groupId: PeopleGroupIdOrSlug,
  documentType: DocumentType,
  config = {}
) {
  return await useAPI<ResearcherDocumentAnalytics>(
    `crisalid/organization/${organisationCode}/people-group/${groupId}/${documentType}/analytics/`,
    config
  )
}

export async function getResearchDocumentSimilars(
  organisationCode: string,
  documentId: Document['id'],
  config = {}
) {
  return await useAPI<PaginationResult<Document>>(
    `crisalid/organization/${organisationCode}/document/${documentId}/similars/`,
    config
  )
}

type ConfigSearch = UseApiOptions<QueryFilterResearcher>
type ResearcherSearchResponse = {
  // key is harvester values
  [key: string | number]: Researcher
}
export async function searchResearcher(
  organizationCode: OrganizationModel['code'],
  config: ConfigSearch = {}
) {
  return useAPI<PaginationResult<ResearcherSearchResponse>>(
    `crisalid/organization/${organizationCode}/researcher/search/`,
    config
  )
}
