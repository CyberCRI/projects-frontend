import {
  Document,
  DocumentType,
  Researcher,
  ResearcherDocumentAnalytics,
} from '@/interfaces/researcher'
import { PeopleGroupModel } from '@/models/invitation.model'

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
  groupId: PeopleGroupModel['id'],
  documentType: DocumentType,
  config = {}
) {
  return await useAPI<PaginationResult<Document>>(
    `crisalid/organization/${organisationCode}/group/${groupId}/${documentType}/`,
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
    `crisalid/organization/${organisationCode}/researcher/${researchId}/${documentType}/analytics`,
    config
  )
}

export async function getGroupResearchDocumentAnalytics(
  organisationCode: string,
  groupId: PeopleGroupModel['id'],
  documentType: DocumentType,
  config = {}
) {
  return await useAPI<ResearcherDocumentAnalytics>(
    `crisalid/organization/${organisationCode}/group/${groupId}/${documentType}/analytics`,
    config
  )
}

export async function getResearchDocumentSimilars(
  organisationCode: string,
  documentId: Document['id'],
  config = {}
) {
  return await useAPI<PaginationResult<Document>>(
    `crisalid/organization/${organisationCode}/${documentId}/similars/`,
    config
  )
}
