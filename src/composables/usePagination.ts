export type PaginationResult<T = any> = {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: T[]
  /** @example 123 */
  total_page?: number
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
  setPage: (page: number) => boolean
  prev: () => boolean
  next: () => boolean
  last: () => boolean
  first: () => boolean
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
  const canNext = computed(() => current.value < total.value)

  // you can change page directly
  const setPage = (pageValue: number) => {
    if (pageValue < 1 || pageValue > total.value) {
      console.error(`You can't change page to ${pageValue}`)
      return false
    }
    if (pageValue === current.value) {
      return false
    }
    current.value = pageValue
    return true
  }

  const prev = () => {
    if (!canPrev) {
      return false
    }
    current.value -= 1
    return true
  }
  const next = () => {
    if (!canNext) {
      return false
    }
    current.value += 1
    return true
  }
  const first = () => setPage(1)
  const last = () => setPage(total.value)

  const query = (): PaginationQuery => {
    // page - 1 for first page
    const offset = Math.max((current.value - 1) * limit, 0)
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
