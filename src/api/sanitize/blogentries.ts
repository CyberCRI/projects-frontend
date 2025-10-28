import { BlogEntry } from '@/api/Swagger'

/**
 * sort blogEntry by created date
 *
 * @function
 * @name sortBlogEntry
 * @kind variable
 * @param {BlogEntry[]} data
 * @returns {BlogEntry[]}
 * @exports
 */
export const sortBlogEntry = (data: BlogEntry[]): BlogEntry[] => {
  return data.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}
