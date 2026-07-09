import {
  ResearcherDocument,
  ResearcherIdentifier,
  Researcher,
  HarvesterType,
} from 'shared-projects-frontend/models'
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

export const IdentifierFactory = createFactory<ResearcherIdentifier>((faker) => ({
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

export const DocumentFactory = createFactory<ResearcherDocument>((faker) => ({
  id: faker.datatype.number(),
  title: faker.lorem.slug(10),
  description: faker.lorem.text(10),
  document_type: 'JournalArticle',
  contributors: [ResearcherFactory.generate({ user: null }), ResearcherFactory.generate()],
  identifiers: CHOICES.map((harvester) => IdentifierFactory.generate({ harvester })),
  publication_date: faker.date.past(),
  similars: faker.datatype.number(),
}))
