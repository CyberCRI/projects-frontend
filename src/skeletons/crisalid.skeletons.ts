import type {
  ResearcherDocument,
  Identifier,
  ResearcherDocumentAnalytics,
  ResearcherAward,
  Researcher,
  Patent,
  Award,
  Teaching,
  Funding,
} from 'shared-projects-frontend/models'

import { factoriesSkeleton } from '~/skeletons/base.skeletons'
import { userSkeleton } from '~/skeletons/user.skeletons'
import { randomInt } from 'es-toolkit'

export const documentAnalyticsSkeleton = (
  def?: Partial<ResearcherDocumentAnalytics>
): ResearcherDocumentAnalytics => ({
  document_types: {
    JournalArticle: randomInt(10),
    Preface: randomInt(10),
    ConferenceArticle: randomInt(10),
  },
  years: [
    { year: 2020, total: randomInt(10) },
    { year: 2021, total: randomInt(10) },
    { year: 2022, total: randomInt(10) },
    { year: 2023, total: randomInt(10) },
    { year: 2024, total: randomInt(10) },
    { year: 2025, total: randomInt(10) },
    { year: 2026, total: randomInt(10) },
  ],
  roles: {
    aut: randomInt(10),
    cns: randomInt(10),
    dte: randomInt(10),
  },
  ...(def || {}),
})

export const identifierSkeleton = (def?: Identifier): Omit<Identifier, 'id'> => ({
  value: 'lorem',
  harvester: 'hal',
  ...(def || {}),
})

export const researchDocumentSkeleton = (
  def?: Partial<ResearcherDocument>
): Omit<ResearcherDocument, 'id'> => ({
  title: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  document_type: 'Book',
  contributors: [],
  // @ts-expect-error ignore not id
  identifiers: factoriesSkeleton(identifierSkeleton, randomInt(5)),
  publication_date: null,
  modules: {
    similars: 0,
    journals: 0,
  },
  ...(def || {}),
})

export const researcherSkeleton = (def?: Partial<Researcher>): Researcher => ({
  id: -1,
  display_name: '',
  domains: [],
  h_index: null,
  i10_index: null,
  identifiers: [],
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
  },
  short_bio: '',
  user: userSkeleton(),
  bio: '',
  ...(def || {}),
})

export const awardSkeleton = (def?: Partial<Award>): Award => ({
  id: -1,
  name: 'name',
  description: 'Ipsum nostrud offciia dolor esse execitation mollit',
  ...(def || {}),
})

export const researcherAwardSkeleton = (def?: Partial<ResearcherAward>): ResearcherAward => ({
  award: awardSkeleton(def?.award),
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  date: '1970-01-01T00:00:00',
  link: 'http://dev.local',
  ...(def || {}),
})

export const patentSkeleton = (def?: Partial<Patent>): Patent => ({
  date: new Date().toISOString(),
  description: 'Ipsum nostrud offciia dolor esse execitation mollit',
  id: -1,
  link: 'https://empty.org',
  name: 'Ipsum nostrud',
  researchers: [],
  ...(def || {}),
})

export const teachingSkeleton = (def?: Partial<Teaching>): Teaching => ({
  id: -1,
  level: 'Ipsum nostrud offciia dolor',
  spec: 'Ipsum nostrud offciia dolor',
  description: 'Ipsum nostrud offciia dolor esse execitation mollit',
  link: 'https://empty.org',
  name: 'Ipsum nostrud',
  domains: [],
  researcher: null,
  ...(def || {}),
})

export const fundingSkeleton = (def?: Partial<Funding>): Funding => ({
  id: -1,
  description: 'Ipsum nostrud offciia dolor esse execitation mollit',
  name: 'Ipsum nostrud',
  researchers: [],
  currency: 'EUR',
  prices: 45_943_433,
  project_id: null,
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
  ...(def || {}),
})
