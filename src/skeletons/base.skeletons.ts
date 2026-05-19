import { DEFAULT_PAGINATION_LIMIT } from '~/composables/usePagination'
import type { PaginationResult } from '~/composables/usePagination'

export const maxSkeleton = (elementCount: number, limit: number | null): number => {
  const sanLimit = limit ?? DEFAULT_PAGINATION_LIMIT
  return Math.min(elementCount ?? sanLimit, sanLimit)
}

export const factoriesSkeleton = <T>(
  element: () => T,
  number: number,
  max: number = DEFAULT_PAGINATION_LIMIT
): T[] => {
  return Array.from(Array(maxSkeleton(number, max))).map(() => element())
}

export const factoryPagination = <T>(
  element: () => T,
  number: number = DEFAULT_PAGINATION_LIMIT,
  max: number = DEFAULT_PAGINATION_LIMIT
): PaginationResult<T> => {
  const results = factoriesSkeleton(element, number, max)

  return {
    count: results.length,
    results,
  }
}
