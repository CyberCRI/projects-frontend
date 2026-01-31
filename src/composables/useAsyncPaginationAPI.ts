import {
  PaginationResult,
  paginationConfig,
  PaginationQuery,
  usePagination,
} from '@/composables/usePagination'
import { omit } from 'es-toolkit'

import type { AsyncConfig } from './useAsyncAPI'
import useAsyncAPI from './useAsyncAPI'

type AsyncPaginationHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncData>['1']>[0]
  config: {
    query: PaginationQuery
  }
}

type AsyncPaginationConfig<ResDataT, DataT, Result> = Omit<
  AsyncConfig<ResDataT, DataT, Result>,
  'transform'
> & {
  // default configuration of paginations
  paginationConfig?: paginationConfig
  // method to transform data
  transform?: (data: DataT) => DataT
}

type AsyncPaginationParameters<ResDataT, DataT, Result> = [
  Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['0'],
  (
    obj: AsyncPaginationHandler
  ) => ReturnType<Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['1']>,
  AsyncPaginationConfig<ResDataT, DataT, Result>?,
]

/**
 * you can change/set page automaticlym and the request auto refresh it
 * a wrapped composable under useAsyncData and usePagination
 *
 * @constant
 * @name useAsyncPaginationAPI
 * @kind variable
 * @exports
 */
export default function useAsyncPaginationAPI<DataT, Result = undefined>(
  ...params: AsyncPaginationParameters<PaginationResult<DataT>, DataT[], Result>
) {
  const paginationData = useState<PaginationResult>()
  const pagination = usePagination(paginationData, params[2]?.paginationConfig)
  // add paginations in query
  const key = computed(
    () => `${unref(params[0])}::${pagination.limit.value}::${pagination.offset.value}`
  )

  const rest = useAsyncAPI(
    key,
    (ctx) => {
      return params[1]({
        ctx,
        config: {
          query: pagination.query(),
        },
      })
    },
    {
      ...((omit(params[2] ?? {}, ['transform']) ?? {}) as AsyncConfig<
        PaginationResult<DataT>,
        DataT[],
        Result
      >),
      watch: [...(params[2]?.watch || []), pagination.current, pagination.limit],
      default() {
        return params[2]?.default?.() || []
      },
      transform(dataApi) {
        paginationData.value = dataApi
        const results = dataApi.results
        return params[2]?.transform?.(results) || results
      },
    }
  )

  return {
    ...rest,
    pagination,
  }
}
