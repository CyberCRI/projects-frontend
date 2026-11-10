import type {
  ResearcherDocument,
  Researcher,
  HarvesterType,
  TranslatedResearcher,
  Identifier,
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

export const IdentifierFactory = createFactory<Identifier<any>>((faker) => ({
  id: faker.datatype.number(),
  harvester: 'hal',
  value: '',
}))

export const ResearcherFactory = createFactory<Researcher>((faker) => ({
  id: faker.datatype.number(),
  user: UserFactory.generate(),
  display_name: faker.name.firstName(),
  identifiers: CHOICES.map((harvester) => IdentifierFactory.generate({ harvester })),
  bio: faker.lorem.text(10),
  short_bio: faker.lorem.text(10),
  domains: [],
  h_index: null,
  i10_index: null,
  modules: {
    affiliated: 0,
    awards: 0,
    citations: 0,
    conferences: 0,
    domains: 0,
    fundings: 0,
    patents: 0,
    publications: 0,
    similars: 0,
    teachings: 0,
    structures: 0,
  },
}))

export const ResearcherTranslatedFactory = createFactory<TranslatedResearcher>((faker) => ({
  ...ResearcherFactory.generate(),
  user: null,
  $t: {
    bio: faker.lorem.text(10),
    short_bio: faker.lorem.text(10),
  },
  domains: [],
}))

export const DocumentFactory = createFactory<ResearcherDocument>((faker) => ({
  id: faker.datatype.number(),
  title: faker.lorem.slug(10),
  description: faker.lorem.text(10),
  document_type: 'JournalArticle',
  contributors: [ResearcherFactory.generate({ user: null }), ResearcherFactory.generate()],
  identifiers: CHOICES.map((harvester) => IdentifierFactory.generate({ harvester })),
  publication_date: faker.date.past(),
  domains: [],
  modules: {
    similars: faker.datatype.number(),
    journals: faker.datatype.number(),
  },
}))
