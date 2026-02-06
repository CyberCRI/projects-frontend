import {
  Pagination,
  PaginationQuery,
  PaginationResult,
  paginationConfig,
  usePagination,
} from '@/composables/usePagination'
import { omit } from 'es-toolkit'

import type { AsyncConfig } from './useAsyncAPI'
import useAsyncAPI from './useAsyncAPI'

type AsyncPaginationHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncAPI>['1']>[0]
  config: {
    query: PaginationQuery & {
      [key: string]: any
    }
  }
}

type AsyncPaginationConfig<ResDataT, DataT extends PaginationResult, Result> = Omit<
  AsyncConfig<ResDataT, DataT, Result>,
  'transform'
> & {
  // default configuration of paginations
  paginationConfig?: paginationConfig
  // method to transform data
  transform?: (data: DataT) => DataT
  translate?: (data: DataT['results']) => Result
}

type AsyncPaginationParameters<ResDataT, DataT extends PaginationResult, Result> = [
  Parameters<typeof useAsyncAPI<ResDataT, DataT, Result>>['0'],
  (
    obj: AsyncPaginationHandler
  ) => ReturnType<Parameters<typeof useAsyncAPI<ResDataT, DataT, Result>>['1']>,
  AsyncPaginationConfig<ResDataT, DataT, Result>?,
]

type AsyncPaginationcReturn<ResDataT, DataT extends PaginationResult, Result> = Omit<
  ReturnType<typeof useAsyncAPI<ResDataT, DataT, Result>>,
  'data'
> & {
  pagination: Pagination
  data: Result extends undefined ? ComputedRef<DataT['results']> : Result
}

/**
 * you can change/set page automaticlym and the request auto refresh it
 * a wrapped composable under useAsyncData and usePagination
 *
 * @constant
 * @kind variable
 * @exports
 */
export default function useAsyncPaginationAPI<DataT, Result = undefined>(
  ...params: AsyncPaginationParameters<PaginationResult<DataT>, PaginationResult<DataT>, Result>
): AsyncPaginationcReturn<PaginationResult<DataT>, PaginationResult<DataT>, Result> {
  const paginationData = ref<PaginationResult>()
  const pagination = usePagination(paginationData, params[2]?.paginationConfig)

  // add paginations in query
  const key = computed(
    () => `${unref(params[0])}::${pagination.current.value}::${pagination.limit.value}`
  )

  const rest = useAsyncAPI(
    key,
    ({ config }) => {
      return params[1]({
        config: {
          query: {
            ...config.query,
            ...pagination.query(),
          },
        },
      })
    },
    {
      ...((omit(params[2] ?? {}, ['transform', 'translate']) ?? {}) as Omit<
        AsyncConfig<PaginationResult<DataT>, PaginationResult<DataT>, Result>,
        'translate'
      >),
      watch: [...(params[2]?.watch || []), pagination.current, pagination.limit],
      deep: false,
    }
  )

  const data = rest.data
  watch(data, () => (paginationData.value = rest.data.value))

  const results = computed(() => data.value?.results)
  // @ts-expect-error betwwen translate and raw
  const subData = params[2]?.translate ? params[2]?.translate(results) : results

  return {
    ...rest,
    // @ts-expect-error betwwen translate and raw
    data: subData,
    pagination,
  }
}
