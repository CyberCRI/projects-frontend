import { PaginatedAccessRequestList } from '@/api/Swagger'

export type PaginationResult<T = any[]> = Omit<PaginatedAccessRequestList, 'results'> & {
  results: T
}

export type PaginationQuery = {
  limit: number
  offset?: number
}

const DEFAULT_Pagination_LIMIT = 100
export type paginationConfig = {
  limit?: number
  offset?: number
}

export type Pagination = {
  current: Ref<number>
  total: Ref<number>
  count: Ref<number>
  setPage: (page: number) => void
  prev: () => void
  next: () => void
  last: () => void
  first: () => void
  canPrev: Ref<boolean>
  canNext: Ref<boolean>
  query: () => PaginationQuery
}

/**
 * composable to easier use paginate Results (for next/prev page)
 *
 */
export const usePagination = (
  results: Ref<PaginationResult>,
  paginationConfig: paginationConfig = {}
): Pagination => {
  const current = ref(1)
  const total = ref(0)
  const count = ref(0)
  const limit = paginationConfig.limit ?? DEFAULT_Pagination_LIMIT

  watch(
    results,
    () => {
      current.value = results.value?.current_page ?? 0
      total.value = results.value?.total_page ?? 0
      count.value = results.value?.count ?? 0
    },
    { deep: true, immediate: true }
  )

  const canPrev = computed(() => current.value > 1)
  const canNext = computed(() => current.value + 1 < total.value)

  // you can change page directly
  const setPage = (pageValue: number) => {
    if (pageValue < 1 || pageValue > total.value) {
      console.error(`You can't change page to ${pageValue}`)
      return
    }
    current.value = pageValue
  }

  const prev = () => {
    if (!canPrev) {
      return
    }
    current.value -= 1
  }
  const next = () => {
    if (!canNext) {
      return
    }
    current.value += 1
  }
  const first = () => setPage(0)
  const last = () => {
    setPage(total.value)
  }

  const query = (): PaginationQuery => {
    // page - 1 for first page
    const offset = (current.value - 1) * limit
    return {
      offset,
      limit,
    }
  }

  return {
    current,
    setPage,
    total,
    count,
    prev,
    canPrev,
    next,
    canNext,
    first,
    last,
    query,
  }
}
