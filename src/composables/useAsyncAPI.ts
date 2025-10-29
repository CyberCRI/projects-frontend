import {
  Paginated,
  PaginatedConfig,
  PaginatedQuery,
  usePaginated,
} from '@/composables/usePaginated'
import { omit } from 'es-toolkit'

/**
 * wrapper around useAsyncData (for watch local change TODO !)
 *
 * @constant
 * @name useAsyncAPI
 * @kind variable
 * @type {<ResT, DataT>(key: globalThis.MaybeRefOrGetter<string>, handler: (ctx?: NuxtApp) => Promise<ResT>, options?: AsyncDataOptions<ResT, DataT, KeysOf<DataT>, DataT>) => AsyncData<DataT | PickFrom<DataT, KeysOf<DataT>>, NuxtError<unknown>>}
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
  return useAsyncData<ResT, unknown, DataT>(...params)
}

type AsyncPaginatedHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncData>['1']>[0]
  query: PaginatedQuery
}

type AsyncDataConfig<ResT, DataT> = Parameters<typeof useAsyncData<ResT, unknown, DataT>>['2']

type AsyncPaginatedConfig<ResT, DataT> = Omit<AsyncDataConfig<ResT, DataT>, 'transform'> & {
  // default configuration of paginations
  paginatedConfig?: PaginatedConfig
  // method to transform data
  transform?: (data: DataT) => DataT
}

type AsyncPaginatedParameters<ResT, DataT> = [
  Parameters<typeof useAsyncData<ResT, unknown, DataT>>['0'],
  (
    obj: AsyncPaginatedHandler
  ) => ReturnType<Parameters<typeof useAsyncData<ResT, unknown, DataT>>['1']>,
  AsyncPaginatedConfig<ResT, DataT>?, // config is optional
]
/**
 * you can change/set page automaticlym and the request auto refresh it
 * a wrapped composable under useAsyncData and usePaginated
 *
 * @constant
 * @name useAsyncPaginatedAPI
 * @kind variable
 * @type {<ResT extends Paginated<ResT["results"]>, DataT = ResT["results"]>(params_0: globalThis.MaybeRefOrGetter<string>, params_1: (obj: AsyncPaginatedHandler) => Promise<ResT>, params_2?: AsyncPaginatedConfig<ResT, DataT>) => { paginated: { page: globalThis.Ref<number, number>; setPage: (pageValue: number) => void; total: globalThis.Ref<number, number>; prev: () => void; canPrev: globalThis.ComputedRef<boolean>; next: () => void; canNext: globalThis.ComputedRef<boolean>; query: () => PaginatedQuery; }; ... 10 more ...; [Symbol.toStringTag]: string; }}
 * @exports
 */
export const useAsyncPaginatedAPI = <
  ResT extends Paginated<ResT['results']>,
  DataT = ResT['results'],
>(
  ...params: AsyncPaginatedParameters<ResT, DataT>
) => {
  const paginatedData = ref()
  const paginated = usePaginated(paginatedData, params[2]?.paginatedConfig)

  // pass all arguements, but override the transform data
  const results = useAsyncAPI<ResT, DataT>(
    params[0],
    // override handler to add paginated query
    (ctx) => {
      return params[1]({
        ctx,
        query: paginated.query(),
      })
    },
    {
      // add all params without transform
      ...((omit(params[2], ['transform']) ?? {}) as AsyncDataConfig<ResT, DataT>),
      // add page watcher
      watch: [...[params[2]?.watch || []], paginated.page],

      transform(dataApi) {
        paginatedData.value = dataApi
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
    paginated,
  }
}
