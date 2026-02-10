import { PaginationResult } from '@/composables/usePagination'
import type { Document, ResearcherDocumentAnalytics } from '@/interfaces/researcher.ts'

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
export const sanitizeResearcherDocuments = (data: PaginationResult<Document>) => {
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
  data: ResearcherDocumentAnalytics['years'],
  limit?: number
): AnalyticsYears => {
  const info: AnalyticsYears = {
    minYear: null,
    maxYear: null,
    bar: [],
  }
  data.forEach((o) => {
    info.bar.push({
      count: o.total,
      year: o.year,
      height: 0,
    })
  })

  info.bar = info.bar.toSorted((a, b) => a.year - b.year)
  if (limit) {
    info.bar = info.bar.slice(-limit)
  }
  info.minYear = info.bar.at(0).year
  info.maxYear = info.bar.at(-1).year

  const maxCount = Math.max(...info.bar.map((el) => el.count))
  info.bar.forEach((obj) => {
    obj.height = (obj.count / maxCount) * 100
  })

  return info
}

const NOT_ALPHA_NUMERIC_REGEX = /[^a-zA-Z0-9_-]/gi
const TRIM_DASH_REGEX = /^-*|-*$/gi
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
  return k.replaceAll(NOT_ALPHA_NUMERIC_REGEX, '-').replaceAll(TRIM_DASH_REGEX, '')
}
