import { Document, ResearcherDocumentAnalytics } from '@/interfaces/researcher'

export const documentAnalyticsSkeleton: ResearcherDocumentAnalytics = {
  document_types: {
    skeleton: 0,
    skeleton1: 0,
    skeleton2: 0,
  },
  years: [
    { year: 2020, total: Math.ceil(Math.random() * 10) },
    { year: 2021, total: Math.ceil(Math.random() * 10) },
    { year: 2022, total: Math.ceil(Math.random() * 10) },
    { year: 2023, total: Math.ceil(Math.random() * 10) },
    { year: 2024, total: Math.ceil(Math.random() * 10) },
    { year: 2025, total: Math.ceil(Math.random() * 10) },
    { year: 2026, total: Math.ceil(Math.random() * 10) },
  ],
  roles: {
    skeleton: 0,
    skeleton1: 0,
    skeleton2: 0,
  },
}

export const researchDocumentSkeleton: Omit<Document, 'id'> = {
  title: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit.',
  document_type: 'skeletons',
  contributors: [],
  identifiers: [],
  publication_date: null,
  similars: 0,
}
