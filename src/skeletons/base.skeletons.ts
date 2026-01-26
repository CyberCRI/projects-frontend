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
