import { DEFAULT_PAGINATION_LIMIT, PaginationResult } from '@/composables/usePagination'

export const maxSkeleton = (elementCount: number, limit: number | null): number => {
  const sanLimit = limit ?? DEFAULT_PAGINATION_LIMIT
  return Math.min(elementCount ?? sanLimit, sanLimit)
}

export const factoriesSkeleton = <T>(element: () => T, number: number): T[] => {
  return Array.from(Array(maxSkeleton(number, DEFAULT_PAGINATION_LIMIT))).map(() => element())
}

export const factoryPagination = <T>(
  element: () => T,
  number: number = DEFAULT_PAGINATION_LIMIT
): PaginationResult<T> => {
  const results = factoriesSkeleton(element, number)

  return {
    count: results.length,
    results,
  }
}
