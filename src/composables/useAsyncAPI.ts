import useLoadingFromStatus from '@/composables/useLoadingFromStatus'

export type AsyncConfig<ResDataT, DataT, Result> = Parameters<
  typeof useAsyncData<ResDataT, unknown, DataT>
>['2'] & {
  translate?: (data: DataT) => Result
}

export type AsyncParameters<ResDataT, DataT, Result> = [
  Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['0'],
  Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['1'],
  AsyncConfig<ResDataT, DataT, Result>?,
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
  params[2] ??= {}
  params[2].watch = [...(params[2].watch || []), locale]
  */

  const { status, data, ...res } = useAsyncData<ResDataT, unknown, DataT>(...params)
  const isLoading = useLoadingFromStatus(status)

  // @ts-expect-error 2345 todo check why
  const dataWrapped = params[2]?.translate?.(data) || data

  const results = {
    ...res,
    status,
    isLoading,
    data: dataWrapped,
  }
  // @ts-expect-error 2322 todo check why
  return results
}
