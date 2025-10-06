import type { Publication } from '@/iterfaces/researcher.ts'

/**
 * sanitize results from publication
 * convert publication_date to DateObject
 *
 * @function
 * @name sanitizeResearcherPublication
 * @kind variable
 * @param {any} data
 * @returns {any}
 * @exports
 */
export const sanitizeResearcherPublication = (data) => {
  const result = data.results as Publication[]
  result.forEach((el) => {
    if (el.publication_date) {
      el.publication_date = new Date(el.publication_date)
    }
  })
  return data
}
