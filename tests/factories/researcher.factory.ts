import { Document, Identifier, Researcher, HarvesterType } from '@/interfaces/researcher'
import { createFactory } from 'faker-create-factory'
import { UserFactory } from './user.factory'

const CHOICES: HarvesterType[] = [
  'hal',
  'scanr',
  'openalex',
  'idref',
  'scopus',
  'orcid',
  'local',
  'doi',
]

export const IdentifierFactory = createFactory<Identifier>((faker) => ({
  id: faker.datatype.number(),
  harvester: 'hal',
  value: '',
}))

export const ResearcherFactory = createFactory<Researcher>((faker) => ({
  id: faker.datatype.number(),
  user: UserFactory.generate(),
  display_name: faker.name.firstName(),
  identifiers: CHOICES.map((harvester) => IdentifierFactory.generate({ harvester })),
}))

export const DocumentFactory = createFactory<Document>((faker) => ({
  id: faker.datatype.number(),
  title: faker.lorem.slug(10),
  description: faker.lorem.text(10),
  document_type: 'journalArticle',
  contributors: [ResearcherFactory.generate({ user: null }), ResearcherFactory.generate()],
  identifiers: CHOICES.map((harvester) => IdentifierFactory.generate({ harvester })),
  publication_date: faker.date.past(),
  similars: faker.datatype.number(),
}))
