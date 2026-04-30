import type { PeopleGroupIdOrSlug } from '~/models/invitation.model'

import type {
  Document,
  DocumentType,
  Researcher,
  ResearcherDocumentAnalytics,
} from '~/interfaces/researcher'

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
