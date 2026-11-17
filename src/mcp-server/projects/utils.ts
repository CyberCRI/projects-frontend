import type { TagModel } from 'shared-projects-frontend/models'
import { omitBy, pick } from 'es-toolkit'
import N from './zod-schema-utils'

export const addIfExists = <T, Res>(key: string, obj: any, func: (data: T) => Res) => {
  if (obj[key]) {
    return {
      [key]: func(obj[key]),
    }
  }
  return {}
}

export const tagMapPreview = (tag: TagModel) => ({
  item_type: 'tag',
  ...pick(tag, ['id', 'title', 'description']),
})

export const PAGINATION_INPUT = {
  limit: N.number().describe('Max number of results to return (default 10)'),
  offset: N.number().describe('Number of results to skip, for pagination (default 0)'),
}

/**
 * Build a query object from tool args: removes null / undefined values
 * and applies pagination defaults
 */
export const buildQuery = <T extends Record<string, any>>(
  args: T & { limit?: number | null; offset?: number | null }
) =>
  omitBy({ ...args, limit: args.limit ?? 10, offset: args.offset ?? 0 }, (value) => value == null)

export const domainMapPreview = (domain: { id: number; level: number; domain: TagModel }) => ({
  item_type: 'research_domain',
  id: domain.id,
  level: domain.level,
  tag: tagMapPreview(domain.domain),
})
