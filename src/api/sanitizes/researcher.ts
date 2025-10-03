import type { Publication } from '@/iterfaces/researcher.ts'

export const sanitizeResearcherPublication = (data) => {
  const result = data.results as Publication[]
  result.forEach((el) => {
    if (el.publication_date) {
      el.publication_date = new Date(el.publication_date)
    }
  })
  return data
}

type ResearcherPublicationAnalytics = {
  year: string | Date | number
  count: number
}

export const sanitizeResearcherPublicationAnalytics = (data) => {
  const years = data.years as ResearcherPublicationAnalytics[]
  years.forEach((el) => {
    el.year = new Date(el.year).getFullYear()
  })

  data.years = years.reverse()
  return data
}
