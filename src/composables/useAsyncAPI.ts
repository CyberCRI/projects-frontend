import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
import { isNil } from 'es-toolkit'

type AsyncHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncData>['1']>[0]
  config: {
    query?: any
  }
}

export type AsyncConfig<ResDataT, DataT, Result> = Parameters<
  typeof useAsyncData<ResDataT, unknown, DataT>
>['2'] & {
  translate?: (data: DataT) => Result
  query?: object
  checkArgs?: boolean
}

export type AsyncParameters<ResDataT, DataT, Result> = [
  Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['0'],
  (obj: AsyncHandler) => ReturnType<Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['1']>,
  AsyncConfig<ResDataT, DataT, Result>,
]

type AsyncReturn<ResDataT, DataT, Result> = Omit<
  ReturnType<typeof useAsyncData<ResDataT, unknown, DataT>>,
  'data'
> & {
  data: Result extends undefined
    ? ReturnType<typeof useAsyncData<ResDataT, unknown, DataT>>['data']
    : Result
  isLoading: ComputedRef<boolean>
}

/**
 * wrapper around useAsyncData (for watch local change TODO !)
 *
 * @constant
 * @name useAsyncAPI
 * @kind variable
 * @exports
 */
export default function useAsyncAPI<ResDataT, DataT = ResDataT, Result = undefined>(
  ...params: AsyncParameters<ResDataT, DataT, Result>
): AsyncReturn<ResDataT, DataT, Result> {
  /*
  TODO: this code refresh request when local change (no more send)
        multiple value for same keys like "title_en", "title_es", "title_fr" ..ect
  const { locale } = useNuxtI18n()
  params[2].watch = [...(params[2].watch || []), locale]
  */
  params[2] ??= {}
  params[2].watch ??= []
  if (params[2].query) {
    params[2].watch.push(params[2].query)
  }

  const checkArgs = computed(() => {
    return params[2].watch.map((v) => unref(v)).filter((v) => isNil(v)).length === 0
  })

  const { status, data, ...res } = useAsyncData<ResDataT, unknown, DataT>(
    params[0],
    ({}) => {
      if (params[2].checkArgs && checkArgs.value === false) {
        return new Promise(() => params[2]?.default() || {})
      }

      const conf = {} as AsyncHandler['config']
      if (params[2].query) {
        conf.query = unref(params[2].query)
      } else {
        conf.query ??= {}
      }
      return params[1]({ config: conf })
    },
    params[2]
  )
  const isLoading = useLoadingFromStatus(status)

  // @ts-expect-error 2345 todo check why
  const dataWrapped = params[2]?.translate?.(data) || data

  const results = {
    ...res,
    status,
    isLoading,
    data: dataWrapped,
  }

  // log error only in dev
  if (import.meta.dev) {
    watchEffect(() => {
      if (results.error.value) {
        console.error(results.error.value)
      }
    })
  }

  // @ts-expect-error 2322 todo check why
  return results
}
