import { DEFAULT_PAGINATION_LIMIT, PaginationResult } from '@/composables/usePagination'

export const toArray = <T>(element: T, number: number): T[] => {
  return Array(number ?? DEFAULT_PAGINATION_LIMIT).fill(element)
}

export const toPagination = <T>(
  element: T,
  number: number = DEFAULT_PAGINATION_LIMIT
): PaginationResult<T> => {
  const results = toArray(element, number)

  return {
    count: results.length,
    results,
  }
}

export const maxSkeleton = (elementCount: number, limit: number | null): number => {
  const sanLimit = limit ?? DEFAULT_PAGINATION_LIMIT
  return Math.min(elementCount ?? sanLimit, sanLimit)
}
