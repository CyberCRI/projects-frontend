import { Document, Identifier, ResearcherDocumentAnalytics } from '@/interfaces/researcher'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
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

export const identifierSkeleton = (def?: Partial<Identifier>): Omit<Identifier, 'id'> => ({
  value: 'lorem',
  harvester: 'hal',
  ...(def || {}),
})

export const researchDocumentSkeleton = (def?: Partial<Document>): Omit<Document, 'id'> => ({
  title: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  document_type: 'Book',
  contributors: [],
  // @ts-expect-error ignore not id
  identifiers: factoriesSkeleton(identifierSkeleton, randomInt(5)),
  publication_date: null,
  similars: 0,
  ...(def || {}),
})
