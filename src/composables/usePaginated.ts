import { PaginatedAccessRequestList } from '@/api/Swagger'

type Paginated<T = any[]> = Omit<PaginatedAccessRequestList, 'results'> & {
  results: T
}

type PaginatedQuery = {
  limit: number
  offset?: number
}

const DEFAULT_PAGINATED_LIMIT = 100
type PaginatedConfig = {
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

  const query = () => {
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

type AsyncPaginatedHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncData>['1']>[0]
  query: PaginatedQuery
}

type AsyncDataConfig<ResT, DataT> = Parameters<typeof useAsyncData<ResT, unknown, DataT>>['2']

type AsyncPaginatedConfig<ResT, DataT> = Omit<AsyncDataConfig<ResT, DataT>, 'transform'> & {
  paginatedConfig?: PaginatedConfig
}

type AsyncPaginatedParameters<ResT, DataT> = [
  Parameters<typeof useAsyncData<ResT, unknown, DataT>>['0'],
  (
    obj: AsyncPaginatedHandler
  ) => ReturnType<Parameters<typeof useAsyncData<ResT, unknown, DataT>>['1']>,
  AsyncPaginatedConfig<ResT, DataT>,
]
/**
 * you can change/set page automaticlym and the request auto refresh it
 * a wrapped composable under useAsyncData and usePaginated
 *
 * @constant
 * @name useAsyncPaginatedData
 * @kind variable
 * @type {<ResT extends Paginated<ResT["results"]>, DataT = ResT["results"]>(params_0: globalThis.MaybeRefOrGetter<string>, params_1: (obj: AsyncPaginatedHandler) => Promise<ResT>, params_2: AsyncPaginatedConfig<ResT, DataT>) => { paginated: { page: globalThis.Ref<number, number>; setPage: (pageValue: number) => void; total: globalThis.Ref<number, number>; prev: () => void; canPrev: globalThis.ComputedRef<boolean>; next: () => void; canNext: globalThis.ComputedRef<boolean>; query: () => { ...; }; }; ... 10 more ...; [Symbol.toStringTag]: string; }}
 * @exports
 */
export const useAsyncPaginatedData = <
  ResT extends Paginated<ResT['results']>,
  DataT = ResT['results'],
>(
  ...params: AsyncPaginatedParameters<ResT, DataT>
) => {
  const paginatedData = ref()
  const paginated = usePaginated(paginatedData, params[2]?.paginatedConfig)

  // pass all arguements, but override the transform data
  const results = useAsyncData<ResT, unknown, DataT>(
    params[0],
    // override handler to add paginated query
    (ctx) => {
      return params[1]({
        ctx,
        query: paginated.query(),
      })
    },
    {
      ...((params[2] ?? {}) as AsyncDataConfig<ResT, DataT>),
      // add page watcher
      watch: [...[params[2]?.watch || []], paginated.page],

      transform(dataApi: ResT) {
        paginatedData.value = dataApi
        // @ts-ignore
        if (params[2]?.transform) {
          // @ts-ignore
          return params[2].transform(dataApi.results)
        }
        return dataApi.results as DataT
      },
    }
  )

  return {
    ...results,
    paginated,
  }
}
