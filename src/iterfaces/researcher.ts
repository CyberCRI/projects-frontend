export type Identifier = {
  id: number
  value: string
  harvester: 'hal' | 'scanr' | 'openalex' | 'idref' | 'scopus' | 'orcid' | 'local'
}

export type Researcher = {
  id: number
  user: null | object
  display_name: string
  identifiers: Identifier[]
}

export type Document = {
  id: number
  title: string
  description: string
  document_type: null | string
  contributors: Researcher[]
  identifiers: Identifier[]
  publication_date: string | null | Date
}

export type ResearcherDocumentAnalytics = {
  year: string | Date | number
  count: number
}
