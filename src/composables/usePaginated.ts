import { PaginatedAccessRequestList } from '@/api/Swagger'

export type Paginated<T = any[]> = Omit<PaginatedAccessRequestList, 'results'> & {
  results: T
}

export type PaginatedQuery = {
  limit: number
  offset?: number
}

const DEFAULT_PAGINATED_LIMIT = 100
export type PaginatedConfig = {
  limit?: number
  offset?: number
}

/**
 * composable to easier use paginate Results (for next/prev page)
 *
 * @function
 * @name usePaginated
 * @kind variable
 * @param {globalThis.Ref<Paginated<any[]>} results
 * @param {PaginatedConfig} Paginated<any[]>>
 * @param {globalThis.Ref<number} PaginatedConfig) => { page
 * @param {(pageValue: number) => void total} number> setPage
 * @param {number> prev} globalThis.Ref<number
 * @param {globalThis.ComputedRef<boolean> next} () => void canPrev
 * @param {globalThis.ComputedRef<boolean> query} () => void canNext
 * @param {any} (
 * @returns {{ offset: number; limit: number; }; }}
 * @exports
 */
export const usePaginated = (results: Ref<Paginated>, PaginatedConfig: PaginatedConfig) => {
  const page = ref<number>(1)
  const total = ref<number>(0)
  const limit = PaginatedConfig.limit ?? DEFAULT_PAGINATED_LIMIT

  watch(
    () => results.value.current_page,
    () => {
      page.value = results.value.current_page ?? 0
    },
    { deep: true, immediate: true }
  )

  watch(
    () => results.value.total_page,
    () => {
      total.value = results.value.total_page ?? 0
    },
    { deep: true, immediate: true }
  )

  const canPrev = computed(() => page.value > 1)
  const canNext = computed(() => page.value + 1 < total.value)

  // you can change page directly
  const setPage = (pageValue: number) => {
    if (!canPrev.value || !canNext.value) {
      console.error(`You can't change page to ${page}`)
      return
    }
    page.value = pageValue
  }

  const prev = () => {
    if (!canPrev) {
      return
    }
    page.value -= 1
  }
  const next = () => {
    if (!canNext) {
      return
    }
    page.value += 1
  }

  const query = (): PaginatedQuery => {
    // page - 1 for first page
    const offset = (page.value - 1) * limit
    return {
      offset,
      limit,
    }
  }

  return {
    page,
    setPage,
    total,
    prev,
    canPrev,
    next,
    canNext,
    query,
  }
}
