import { DEFAULT_PAGINATION_LIMIT } from '@/composables/usePagination'

export const toArray = <T>(element: T, number: number = DEFAULT_PAGINATION_LIMIT): T[] => {
  return Array(number ?? DEFAULT_PAGINATION_LIMIT).fill(element)
}
