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

export type DocumentSource = {
  document_type: null
  identifier: Identifier
}

export type Document = {
  id: number
  title: string
  authors: Researcher[]
  sources: DocumentSource[]
  publication_date: string | null | Date
}
