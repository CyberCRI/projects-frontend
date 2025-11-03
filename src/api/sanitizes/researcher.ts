import type { Document } from '@/iterfaces/researcher.ts'

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
export const sanitizeResearcherDocument = (data): Document => {
  const result = data.results as Document[]
  result.forEach((el) => {
    if (el.publication_date) {
      el.publication_date = new Date(el.publication_date)
    }
  })
  return data
}
