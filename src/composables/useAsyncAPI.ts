import {
  PaginationResult,
  paginationConfig,
  PaginationQuery,
  usePagination,
  Pagination,
} from '@/composables/usePagination'
import { omit } from 'es-toolkit'

/**
 * wrapper around useAsyncData (for watch local change TODO !)
 *
 * @constant
 * @name useAsyncAPI
 * @kind variable
 * @exports
 */
export const useAsyncAPI = <ResT, DataT>(
  ...params: Parameters<typeof useAsyncData<ResT, unknown, DataT>>
) => {
  /*
  TODO: this code refresh request when local change (no more send)
        multiple value for same keys like "title_en", "title_es", "title_fr" ..ect
  const { locale } = useNuxtI18n()
  params[2] ??= {}
  params[2].watch = [...(params[2].watch || []), locale]
  */
  const res = useAsyncData<ResT, unknown, DataT>(...params)
  const isLoading = useLoadingFromStatus(res.status)
  return {
    ...res,
    isLoading,
  }
}

type AsyncPaginationHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncData>['1']>[0]
  config: {
    query: PaginationQuery
  }
}

type AsyncDataConfig<ResT, DataT> = Parameters<typeof useAsyncData<ResT, unknown, DataT>>['2']

type AsyncpaginationConfig<DataT> = Omit<
  AsyncDataConfig<PaginationResult<DataT>, DataT[]>,
  'transform'
> & {
  // default configuration of paginations
  paginationConfig?: paginationConfig
  // method to transform data
  transform?: (data: DataT[]) => DataT[]
}

type AsyncPaginationParameters<DataT> = [
  Parameters<typeof useAsyncData<PaginationResult<DataT>, unknown, DataT[]>>['0'],
  (
    obj: AsyncPaginationHandler
  ) => ReturnType<Parameters<typeof useAsyncData<PaginationResult<DataT>, unknown, DataT[]>>['1']>,
  AsyncpaginationConfig<DataT>?,
]

type asyncPaginationAPI<DataT> = ReturnType<
  typeof useAsyncAPI<PaginationResult<DataT>, DataT[]>
> & {
  pagination: Pagination
}

/**
 * you can change/set page automaticlym and the request auto refresh it
 * a wrapped composable under useAsyncData and usePagination
 *
 * @constant
 * @name useAsyncPaginationAPI
 * @kind variable
 * @exports
 */
export const useAsyncPaginationAPI = <DataT = unknown>(
  ...params: AsyncPaginationParameters<DataT>
): asyncPaginationAPI<DataT> => {
  const paginationData = ref()
  const pagination = usePagination(paginationData, params[2]?.paginationConfig)
  const config = defaultOptions()

  // pass all arguements, but override the transform data
  const results = useAsyncAPI<PaginationResult<DataT>, DataT[]>(
    params[0],
    // override handler to add pagination query
    (ctx) => {
      return params[1]({
        ctx,
        config: {
          ...config,
          query: pagination.query(),
        },
      })
    },
    {
      // add all params without transform
      ...((omit(params[2] ?? {}, ['transform']) ?? {}) as AsyncDataConfig<
        PaginationResult<DataT>,
        DataT[]
      >),
      // add page watcher
      watch: [...(params[2]?.watch || []), pagination.current],

      // default() {
      //   // return by defaults a emptys arrays
      //   return params[2]?.default?.() || []
      // },

      transform(dataApi) {
        paginationData.value = dataApi
        const results = dataApi.results
        return params[2]?.transform?.(results) || results
      },
    }
  )

  return {
    ...results,
    pagination,
  }
}
