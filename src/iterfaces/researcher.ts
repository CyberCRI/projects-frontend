import { UserModel } from '@/models/user.model'

export type QueryFilterDocument = {
  year?: number
  document_type?: string
  roles?: string
}

export type Identifier = {
  id: number
  value: string
  harvester: 'hal' | 'scanr' | 'openalex' | 'idref' | 'scopus' | 'orcid' | 'local'
}

export type Researcher = {
  id: number
  user: null | UserModel
  display_name: string
  identifiers: Identifier[]
}

export type ResearcherLight = Researcher & {
  documents: {
    publications: number
    conferences: number
  }
}

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
