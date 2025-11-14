import { PaginationResult } from '@/composables/usePagination'
import type { Document, ResearcherDocumentAnalytics } from '@/iterfaces/researcher.ts'

/**
 * sanitize results from publication
 * convert publication_date to DateObject
 *
 * @function
 * @name sanitizeResearcherDocument
 * @kind variable
 * @param {any} data
 * @returns {any}
 * @exports
 */
export const sanitizeResearcherDocument = (data: PaginationResult<Document>) => {
  const result = data.results
  result.forEach((el) => {
    if (el.publication_date) {
      el.publication_date = new Date(el.publication_date)
    }
  })
  return data
}

type AnalyticsYears = {
  minYear: number
  maxYear: number
  // sorted by year
  bar: Array<{
    count: number
    year: number
    height: number
  }>
}

/**
 * sanitize document year info for bar/chart
 *
 * @function
 * @name sanitizeResearcherDocumentAnalyticsYears
 * @kind variable
 * @param {{ year: number total: number }[]} data
 * @returns {AnalyticsYears}
 * @exports
 */
export const sanitizeResearcherDocumentAnalyticsYears = (
  data: ResearcherDocumentAnalytics['years']
): AnalyticsYears => {
  const info: AnalyticsYears = {
    minYear: null,
    maxYear: null,
    bar: [],
  }
  data.forEach((o) => {
    if (info.minYear == null || info.minYear > o.year) {
      info.minYear = o.year
    }
    if (info.maxYear == null || info.maxYear < o.year) {
      info.maxYear = o.year
    }
    info.bar.push({
      count: o.total,
      year: o.year,
      height: 0,
    })
  })

  const maxCount = Math.max(...info.bar.map((el) => el.count))
  info.bar.forEach((obj) => {
    obj.height = (obj.count / maxCount) * 100
  })

  info.bar = info.bar.reverse()

  return info
}

const INVALID_CHAR_REGEX = /[^a-zA-Z0-9-_]/gi
/**
 * sanitize translate relators/documenttype key for translate
 *
 * @function
 * @name sanitizeTranslateKeys
 * @kind variable
 * @param {string} k
 * @returns {string}
 * @exports
 */
export const sanitizeTranslateKeys = (k: string): string => {
  return k.replaceAll(INVALID_CHAR_REGEX, '-')
}
