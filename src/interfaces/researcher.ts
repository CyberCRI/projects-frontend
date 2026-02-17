import { Translated } from '@/interfaces/translated'
import { UserModel } from '@/models/user.model'

export type QueryFilterDocument = {
  year?: number
  document_type?: string
  roles?: string
  ordering?: 'publication_date' | '-publication_date'
}

export type HarvesterType =
  | 'hal'
  | 'scanr'
  | 'openalex'
  | 'idref'
  | 'scopus'
  | 'orcid'
  | 'local'
  | 'doi'

export type Identifier = {
  id: number
  value: string
  harvester: HarvesterType
}

export type Researcher = {
  id: number
  user: null | UserModel
  display_name: string
  identifiers: Identifier[]
}

export type ResearcherLight = Researcher & {
  // this is a objects with numbers of each documents
  documents: {
    publications: number
    conferences: number
  }
}

export type DocumentType = keyof ResearcherLight['documents']

export type Document = {
  id: number
  title: string
  description: string
  document_type: null | string
  contributors: Researcher[]
  identifiers: Identifier[]
  publication_date: string | null | Date
  similars: number
}

export type TranslatedDocument = Translated<Document, 'title' | 'description'>

export type ResearcherDocumentAnalytics = {
  document_types: {
    [name: string]: number
  }
  years: Array<{
    year: number
    total: number
  }>
  roles: {
    [name: string]: number
  }
}
