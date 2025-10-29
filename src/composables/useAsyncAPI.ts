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
 * @type {<ResT, DataT>(key: globalThis.MaybeRefOrGetter<string>, handler: (ctx?: NuxtApp) => Promise<ResT>, options?: AsyncDataOptions<ResT, DataT, KeysOf<DataT>, DataT>) => { isLoading: globalThis.ComputedRef<boolean>; data: globalThis.Ref<DataT | PickFrom<DataT, KeysOf<DataT>>, DataT | PickFrom<DataT, KeysOf<DataT>>>; pending: Ref<boolean>; ... 8 more ...; [Symbol.toStringTag]: string; }}
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
  const isLoading = computed(() => res.status.value !== 'success')
  return {
    ...res,
    isLoading,
  }
}

type AsyncPaginationHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncData>['1']>[0]
  query: PaginationQuery
}

type AsyncDataConfig<ResT, DataT> = Parameters<typeof useAsyncData<ResT, unknown, DataT>>['2']

type AsyncpaginationConfig<ResT, DataT> = Omit<AsyncDataConfig<ResT, DataT>, 'transform'> & {
  // default configuration of paginations
  paginationConfig?: paginationConfig
  // method to transform data
  transform?: (data: DataT) => DataT
}

type AsyncPaginationParameters<ResT, DataT> = [
  Parameters<typeof useAsyncData<ResT, unknown, DataT>>['0'],
  (
    obj: AsyncPaginationHandler
  ) => ReturnType<Parameters<typeof useAsyncData<ResT, unknown, DataT>>['1']>,
  AsyncpaginationConfig<ResT, DataT>?, // config is optional
]

type asyncPaginationAPI = ReturnType<typeof useAsyncAPI> & {
  pagination: Pagination
}

/**
 * you can change/set page automaticlym and the request auto refresh it
 * a wrapped composable under useAsyncData and usePagination
 *
 * @constant
 * @name useAsyncPaginationAPI
 * @kind variable
 * @type {<ResT extends PaginationResult<ResT["results"]>, DataT = ResT["results"]>(params_0: globalThis.MaybeRefOrGetter<string>, params_1: (obj: AsyncPaginationHandler) => Promise<ResT>, params_2?: AsyncpaginationConfig<ResT, DataT>) => asyncPaginationAPI}
 * @exports
 */
export const useAsyncPaginationAPI = <
  ResT extends PaginationResult<ResT['results']>,
  DataT = ResT['results'],
>(
  ...params: AsyncPaginationParameters<ResT, DataT>
): asyncPaginationAPI => {
  const paginationData = ref()
  const pagination = usePagination(paginationData, params[2]?.paginationConfig)

  // pass all arguements, but override the transform data
  const results = useAsyncAPI<ResT, DataT>(
    params[0],
    // override handler to add pagination query
    (ctx) => {
      return params[1]({
        ctx,
        query: pagination.query(),
      })
    },
    {
      // add all params without transform
      ...((omit(params[2], ['transform']) ?? {}) as AsyncDataConfig<ResT, DataT>),
      // add page watcher
      watch: [...(params[2]?.watch || []), pagination.current],

      default() {
        // return by defaults a emptys arrays
        const def = params[2]?.default?.() || []
        return def as DataT
      },

      transform(dataApi) {
        paginationData.value = dataApi
        const res = dataApi.results as DataT
        if (params[2]?.transform) {
          return params[2].transform(res)
        }
        return res
      },
    }
  )

  return {
    ...results,
    pagination,
  }
}
