import type { Document } from '@/iterfaces/researcher.ts'

export const sanitizeResearcherDocument = (data) => {
  const result = data.results as Document[]
  result.forEach((el) => {
    if (el.publication_date) {
      el.publication_date = new Date(el.publication_date)
    }
  })
  return data
}

type ResearcherDocumentAnalytics = {
  year: string | Date | number
  count: number
}

export const sanitizeResearcherDocumentAnalytics = (data) => {
  const years = data.years as ResearcherDocumentAnalytics[]
  years.forEach((el) => {
    el.year = new Date(el.year).getFullYear()
  })

  data.years = years.reverse()
  return data
}
