import { Document, Identifier, ResearcherDocumentAnalytics } from '@/interfaces/researcher'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { randomInt } from 'es-toolkit'

export const documentAnalyticsSkeleton = (): ResearcherDocumentAnalytics => ({
  document_types: {
    Book: randomInt(10),
    Grant: randomInt(10),
    Note: randomInt(10),
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
    actor: randomInt(10),
    client: randomInt(10),
    funder: randomInt(10),
  },
})

export const identifierSkeleton = (): Omit<Identifier, 'id'> => ({
  value: 'lorem',
  harvester: 'hal',
})

export const researchDocumentSkeleton = (): Omit<Document, 'id'> => ({
  title: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  document_type: 'Book',
  contributors: [],
  // @ts-expect-error ignore not id
  identifiers: factoriesSkeleton(identifierSkeleton, randomInt(5)),
  publication_date: null,
  similars: 0,
})
