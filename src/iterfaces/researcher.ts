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
  document_type: null | string
  authors: Researcher[]
  identifiers: Identifier[]
  publication_date: string | null | Date
}
