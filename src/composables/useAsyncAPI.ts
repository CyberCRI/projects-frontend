import useLoadingFromStatus from '~/composables/useLoadingFromStatus'

import type { ClientAPIOptions } from 'shared-projects-frontend/apis'
import { withQuery } from '~/functs/query'
import { isNil } from 'es-toolkit'

type AsyncHandler = {
  ctx?: Parameters<Parameters<typeof useAsyncData>['1']>[0]
  config: {
    query?: any
    signal?: AbortController['signal']
  }
}

export type AsyncConfig<ResDataT, DataT, Result> = Parameters<
  typeof useAsyncData<ResDataT, unknown, DataT>
>['2'] & {
  translate?: (data: DataT) => Result
  // query params
  query?: ClientAPIOptions['query']
  // d'ont run fetch if any of args/params are null/undefined
  checkArgs?: boolean
  // force fixed key (no add query params in key)
  // like "group::55::members" (no pagination query like 'offset' / 'limit') are added
  keyFixed?: boolean
}

export type AsyncParameters<ResDataT, DataT, Result> = [
  Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['0'],
  (obj: AsyncHandler) => ReturnType<Parameters<typeof useAsyncData<ResDataT, unknown, DataT>>['1']>,
  AsyncConfig<ResDataT, DataT, Result>?,
]

type AsyncReturn<ResDataT, DataT, Result> = Omit<
  ReturnType<typeof useAsyncData<ResDataT, unknown, DataT>>,
  'data'
> & {
  // if Results is undefied (no translate functions) get Results from useAsyncData
  data: Result extends undefined
    ? ReturnType<
        typeof useAsyncData<ResDataT, unknown, DataT extends any ? ResDataT : DataT>
      >['data']
    : Result
  isLoading: ComputedRef<boolean>
  key: ComputedRef<string>
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

  // wraps query around computed to "watch change"
  const orginalQuery = params[2].query
  params[2].query = computed(() => {
    return { ...unref(orginalQuery) }
  })
  params[2].watch.push(params[2].query)

  let immediate = true
  if (params[2].immediate === false) {
    immediate = false
  } else {
    params[2].immediate = false
  }

  const neededArgs = params[2].watch
  const checkArgs = computed(() => {
    return neededArgs.map((v) => unref(v)).filter((v) => isNil(v)).length === 0
  })

  if (immediate === false) {
    params[2].watch = []
  }

  // add query params directly in keys
  // like "organization::CRI::group::55::members" (if query is empty)
  // or "organization::CRI::group::55::members::limit=3::offset=10"
  const key = computed(() => {
    let parentKey = unref(params[0]).toString()
    if (params[2].keyFixed) {
      return parentKey
    }
    withQuery(unref(params[2].query)).forEach(([key, value]) => {
      parentKey = `${parentKey}::${key}=${value}`
    })
    return parentKey
  })

  // signal for aborting
  const controller = ref<AbortController | null>(new AbortController())

  /**
   * abort existing request (with signal)
   *
   * @function
   * @name abort
   * @kind variable
   * @memberof useAsyncAPI
   * @returns {boolean}
   */
  const abort = () => {
    if (controller.value) {
      controller.value.abort()
      controller.value = null
      return true
    }
    return false
  }

  const { status, data, ...res } = useAsyncData<ResDataT, unknown, DataT>(
    key,
    () => {
      if (!checkArgs.value) {
        return null
      }

      // clean exsisting fetch, and create new controller
      abort()
      controller.value = new AbortController()

      const conf = { signal: controller.value.signal } as AsyncHandler['config']
      if (params[2].query) {
        conf.query = unref(params[2].query)
      } else {
        conf.query ??= {}
      }

      return params[1]({ config: conf })
    },
    {
      ...params[2],
    }
  )
  const isLoading = useLoadingFromStatus(status)

  const dataWrapped = params[2]?.translate
    ? // @ts-expect-error 2345 todo check why
      params[2]?.translate(data)
    : computed(() => unref(data))

  const results = {
    ...res,
    status,
    isLoading,
    data: dataWrapped,
    key,
    abort,
  }

  if (immediate) {
    watch(
      checkArgs,
      (newValue) => {
        if (newValue) {
          results.refresh()
        }
      },
      { immediate: true }
    )
  }

  // trigger watch en keyFixed is true
  if (params[2].keyFixed) {
    watch(
      () => JSON.stringify(params[2].watch.map((e) => unref(e))),
      () => {
        results.refresh()
      }
    )
  }

  // log error only in dev
  if (import.meta.dev) {
    watchEffect(() => {
      if (results.error.value) {
        console.error(params[0], results.error.value)
      }
    })
  }

  onUnmounted(() => {
    if (controller.value) {
      controller.value.abort()
      controller.value = null
    }
  })

  // @ts-expect-error 2322 todo check why
  return results
}
